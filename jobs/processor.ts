import { prisma } from '@/lib/prisma';
import { Job, JobType, JobStatus } from '@/types/job';
import { render } from '@react-email/components';
import { UrgentBloodRequestEmail } from '@/emails/urgent-blood-request';
import { CampaignDigestEmail } from '@/emails/campaign-digest';
import {
    getBloodGroupLabel,
    getCompatibleDonorBloodGroups,
} from '@/config/blood-group';
import { BloodGroup } from '@/types/enums';
import { sendEmail } from '@/lib/mail';
import { createUnsubscribeToken, getUnsubscribeUrl } from '@/lib/unsubscribe';
import { getEmailDictionary, getNotificationLocale } from '@/lib/email-i18n';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { ar } from 'date-fns/locale';

const jobHandlers = {
    [JobType.BLOOD_REQUEST_NOTIFICATION]: async (payload: any) => {
        const { requestId } = payload;

        const request = await prisma.bloodRequest.findUnique({
            where: { id: requestId },
            include: {
                city: true,
            },
        });

        if (!request) throw new Error('Blood request not found');

        // Get all blood groups that can donate to the requested blood group
        const compatibleBloodGroups = getCompatibleDonorBloodGroups(
            request.bloodGroup as BloodGroup,
        );

        console.log(
            `Blood request ${request.id}: Requested ${request.bloodGroup}, compatible groups: ${compatibleBloodGroups.join(', ')}`,
        );

        const recipients = await prisma.user.findMany({
            where: {
                role: 'PARTICIPANT',
                receiveBloodRequestEmails: true,
                bloodGroup: {
                    in: compatibleBloodGroups,
                },
                city: {
                    regionId: request.city.regionId,
                },
            },
            select: {
                email: true,
                name: true,
                bloodGroup: true,
                notificationLanguage: true,
            },
        });

        console.log(
            `Found ${recipients.length} compatible donors in region ${request.city.regionId} for blood request ${request.id}`,
        );

        const bloodGroupLabel = getBloodGroupLabel(
            request.bloodGroup as BloodGroup,
            null,
            'request',
        );

        for (const recipient of recipients) {
            const locale = getNotificationLocale(recipient.notificationLanguage);
            const dict = await getEmailDictionary(locale);
            const t = dict.bloodRequest;
            const token = await createUnsubscribeToken(
                recipient.email,
                'BLOOD_REQUEST',
            );
            const unsubscribeUrl = getUnsubscribeUrl(token);

            const template = UrgentBloodRequestEmail({
                bloodGroup: bloodGroupLabel,
                location: request.location,
                city: request.city.name,
                phone: request.phone || undefined,
                description: request.description,
                unsubscribeUrl,
                locale,
                t,
            });

            const emailHtml = await render(template, { pretty: true });
            const emailText = await render(template, { plainText: true });

            const subject = `${t.subjectPrefix} ${bloodGroupLabel} - ${request.city.name}`;
            await sendEmail(
                recipient.email,
                subject,
                emailHtml,
                emailText,
            );

            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    [JobType.CAMPAIGN_DIGEST]: async (payload: any) => {
        const { digestId, regionName, campaigns, recipients } = payload;

        if (!campaigns || campaigns.length === 0) {
            console.log('No campaigns in digest, skipping email');
            return;
        }

        const dateStr = new Date().toISOString().split('T')[0];
        const dateLocales = { fr, en: enUS, ar } as const;

        for (const recipient of recipients) {
            const locale = getNotificationLocale(recipient.notificationLanguage);
            const dict = await getEmailDictionary(locale);
            const t = dict.campaignDigest;
            const dateLocale = dateLocales[locale] ?? fr;
            const formattedDate = format(new Date(dateStr + 'T12:00:00'), 'dd MMMM yyyy', {
                locale: dateLocale,
            });

            const token = await createUnsubscribeToken(
                recipient.email,
                'CAMPAIGN_DIGEST',
            );
            const unsubscribeUrl = getUnsubscribeUrl(token);

            const template = CampaignDigestEmail({
                regionName,
                campaigns,
                date: dateStr,
                unsubscribeUrl,
                locale,
                t,
            });

            const emailHtml = await render(template, { pretty: true });
            const emailText = await render(template, { plainText: true });

            const subject = `📅 ${t.subjectPrefix} - ${regionName} - ${formattedDate}`;
            await sendEmail(
                recipient.email,
                subject,
                emailHtml,
                emailText,
            );

            await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Mark digest as sent
        await prisma.campaignDigest.update({
            where: { id: digestId },
            data: {
                sent: true,
                sentAt: new Date(),
            },
        });

        console.log(
            `Sent digest for region ${regionName} with ${campaigns.length} campaigns to ${recipients.length} recipients`,
        );
    },
};

async function processJob(job: Job) {
    try {
        await prisma.job.update({
            where: { id: job.id },
            data: {
                status: JobStatus.PROCESSING,
                attempts: { increment: 1 },
            },
        });

        await jobHandlers[job.type](job.payload);

        // Mark job as completed
        await prisma.job.update({
            where: { id: job.id },
            data: {
                status: JobStatus.COMPLETED,
                processedAt: new Date(),
            },
        });
    } catch (error: any) {
        console.error('Job processing error:', error);
        // Handle job failure
        const shouldRetry = job.attempts < job.maxAttempts;
        await prisma.job.update({
            where: { id: job.id },
            data: {
                status: shouldRetry ? JobStatus.PENDING : JobStatus.FAILED,
                error: error.message,
            },
        });
    }
}

export async function processPendingJobs() {
    const pendingJobs = (await prisma.job.findMany({
        where: {
            status: JobStatus.PENDING,
            attempts: { lt: 3 },
        },
        orderBy: { createdAt: 'asc' },
        take: 10, // Process 10 jobs at a time
    })) as Job[];

    await Promise.all(pendingJobs.map(processJob));

    return pendingJobs.length;
}
