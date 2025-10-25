import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { Job, JobType, JobStatus } from '@/types/job';
import { render } from '@react-email/components';
import { UrgentBloodRequestEmail } from '@/emails/urgent-blood-request';
import { CampaignDigestEmail } from '@/emails/campaign-digest';
import {
    getBloodGroupLabel,
    getCompatibleDonorBloodGroups,
} from '@/config/blood-group';
import { BloodGroup } from '@/types/enums';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@tabarro3.ma';

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
                bloodGroup: true, // Include blood group for logging/debugging
            },
        });

        console.log(
            `Found ${recipients.length} compatible donors in region ${request.city.regionId} for blood request ${request.id}`,
        );

        // Send individual emails to each recipient
        for (const recipient of recipients) {
            const emailHtml = await render(
                UrgentBloodRequestEmail({
                    bloodGroup: getBloodGroupLabel(
                        request.bloodGroup as BloodGroup,
                    ),
                    location: request.location,
                    city: request.city.name,
                    phone: request.phone || undefined,
                    description: request.description,
                }),
                { pretty: true },
            );

            await transporter.sendMail({
                from: FROM_EMAIL,
                to: recipient.email, // Send to individual recipient
                subject: `Besoin urgent de sang ${getBloodGroupLabel(request.bloodGroup as BloodGroup)} à ${request.city.name} - Votre sang est compatible`,
                html: emailHtml,
            });

            // Small delay between emails to prevent overwhelming the SMTP server
            await new Promise(resolve => setTimeout(resolve, 200));
        }
    },

    [JobType.CAMPAIGN_DIGEST]: async (payload: any) => {
        const { digestId, regionName, campaigns, recipients } = payload;

        if (!campaigns || campaigns.length === 0) {
            console.log('No campaigns in digest, skipping email');
            return;
        }

        const today = new Date().toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        // Send individual digest emails to each recipient
        for (const recipient of recipients) {
            const emailHtml = await render(
                CampaignDigestEmail({
                    regionName,
                    campaigns,
                    date: today,
                }),
                { pretty: true },
            );

            await transporter.sendMail({
                from: FROM_EMAIL,
                to: recipient.email,
                subject: `📅 Résumé des campagnes de don de sang - ${regionName} - ${today}`,
                html: emailHtml,
            });

            // Small delay between emails
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
