import { prisma } from '@/lib/prisma';
import { JobType, Role } from '@prisma/client';
import { discordService } from '@/lib/discord';

export async function queueCampaignNotification(campaignId: number) {
    const job = await prisma.job.create({
        data: {
            type: JobType.CAMPAIGN_NOTIFICATION,
            payload: {
                campaignId,
            },
        },
    });

    // Send Discord notification immediately
    try {
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                city: true,
                organization: true,
                participants: true,
            },
        });

        if (campaign) {
            await discordService.sendNewCampaignNotification(campaign as any);
        }
    } catch (error) {
        console.error('Failed to send Discord campaign notification:', error);
    }

    return job;
}

export async function queueBloodRequestNotification(requestId: number) {
    const job = await prisma.job.create({
        data: {
            type: JobType.BLOOD_REQUEST_NOTIFICATION,
            payload: {
                requestId,
            },
        },
    });

    // Send Discord notification immediately
    try {
        const request = await prisma.bloodRequest.findUnique({
            where: { id: requestId },
            include: {
                city: true,
                user: true,
            },
        });

        if (request) {
            await discordService.sendUrgentBloodRequestNotification(
                request as any,
            );
        }
    } catch (error) {
        console.error(
            'Failed to send Discord blood request notification:',
            error,
        );
    }

    return job;
}

export async function sendWeeklyStatistics() {
    try {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const [
            totalParticipants,
            totalCampaigns,
            totalBloodRequests,
            newParticipantsThisWeek,
            newCampaignsThisWeek,
            urgentRequestsThisWeek,
        ] = await Promise.all([
            prisma.user.count({
                where: {
                    role: Role.PARTICIPANT,
                },
            }),
            prisma.campaign.count(),
            prisma.bloodRequest.count(),
            prisma.user.count({
                where: {
                    role: Role.PARTICIPANT,
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            prisma.campaign.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            }),
            prisma.bloodRequest.count({
                where: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                    status: 'URGENT',
                },
            }),
        ]);

        await discordService.sendWeeklyStatistics({
            totalParticipants,
            totalCampaigns,
            totalBloodRequests,
            newParticipantsThisWeek,
            newCampaignsThisWeek,
            urgentRequestsThisWeek,
        });
    } catch (error) {
        console.error('Failed to send Discord weekly statistics:', error);
    }
}

export async function getNotificationMetrics() {
    const [totalJobs, pendingJobs, failedJobs, completedJobs] =
        await Promise.all([
            prisma.job.count(),
            prisma.job.count({ where: { status: 'PENDING' } }),
            prisma.job.count({ where: { status: 'FAILED' } }),
            prisma.job.count({ where: { status: 'COMPLETED' } }),
        ]);

    const recentFailures = await prisma.job.findMany({
        where: {
            status: 'FAILED',
            updatedAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
        },
        select: {
            id: true,
            type: true,
            error: true,
            attempts: true,
            updatedAt: true,
        },
        orderBy: {
            updatedAt: 'desc',
        },
        take: 10,
    });

    return {
        totalJobs,
        pendingJobs,
        failedJobs,
        completedJobs,
        recentFailures,
    };
}
