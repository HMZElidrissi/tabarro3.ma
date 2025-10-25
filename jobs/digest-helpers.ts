import { prisma } from '@/lib/prisma';
import { JobType } from '@prisma/client';
import { discordService } from '@/lib/discord';

/**
 * Add a campaign to the daily digest for its region
 */
export async function addCampaignToDigest(campaignId: number) {
    try {
        // Get campaign with region info
        const campaign = await prisma.campaign.findUnique({
            where: { id: campaignId },
            include: {
                city: {
                    select: {
                        regionId: true,
                    },
                },
            },
        });

        if (!campaign) {
            throw new Error('Campaign not found');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of day

        // Find or create digest for today and this region
        let digest = await prisma.campaignDigest.findUnique({
            where: {
                date_regionId: {
                    date: today,
                    regionId: campaign.city.regionId,
                },
            },
        });

        if (!digest) {
            digest = await prisma.campaignDigest.create({
                data: {
                    date: today,
                    regionId: campaign.city.regionId,
                },
            });
        }

        // Add campaign to digest (ignore if already exists)
        await prisma.campaignDigestCampaign.upsert({
            where: {
                digestId_campaignId: {
                    digestId: digest.id,
                    campaignId: campaignId,
                },
            },
            update: {}, // No update needed if already exists
            create: {
                digestId: digest.id,
                campaignId: campaignId,
            },
        });

        console.log(
            `Campaign ${campaignId} added to digest for region ${campaign.city.regionId}`,
        );

        // Still send Discord notification immediately
        await sendDiscordCampaignNotification(campaignId);
    } catch (error) {
        console.error('Failed to add campaign to digest:', error);
        throw error;
    }
}

/**
 * Send Discord notification for campaign (immediate)
 */
async function sendDiscordCampaignNotification(campaignId: number) {
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
}

/**
 * Process daily campaign digests (called by scheduled job)
 */
export async function processCampaignDigests() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Get all unsent digests for today
        const digests = await prisma.campaignDigest.findMany({
            where: {
                date: today,
                sent: false,
            },
            include: {
                region: true,
                campaigns: {
                    include: {
                        campaign: {
                            include: {
                                organization: true,
                                city: true,
                            },
                        },
                    },
                    where: {
                        campaign: {
                            createdAt: {
                                gte: today, // Only campaigns created today
                            },
                        },
                    },
                },
            },
        });

        console.log(`Found ${digests.length} digests to process`);

        for (const digest of digests) {
            // Skip if no campaigns
            if (digest.campaigns.length === 0) {
                console.log(
                    `Skipping empty digest for region ${digest.region.name}`,
                );
                continue;
            }

            await processDigestForRegion(digest);
        }

        return digests.length;
    } catch (error) {
        console.error('Failed to process campaign digests:', error);
        throw error;
    }
}

/**
 * Process digest for a specific region
 */
async function processDigestForRegion(digest: any) {
    try {
        const campaigns = digest.campaigns.map((dc: any) => dc.campaign);

        // Get all participants in this region
        const recipients = await prisma.user.findMany({
            where: {
                role: 'PARTICIPANT',
                city: {
                    regionId: digest.regionId,
                },
            },
            select: {
                email: true,
                name: true,
            },
        });

        if (recipients.length === 0) {
            console.log(`No recipients found for region ${digest.region.name}`);
            return;
        }

        // Queue digest email job
        await prisma.job.create({
            data: {
                type: JobType.CAMPAIGN_DIGEST,
                payload: {
                    digestId: digest.id,
                    regionName: digest.region.name,
                    campaigns: campaigns,
                    recipients: recipients,
                },
            },
        });

        console.log(
            `Queued digest for region ${digest.region.name} with ${campaigns.length} campaigns for ${recipients.length} recipients`,
        );
    } catch (error) {
        console.error(
            `Failed to process digest for region ${digest.region.name}:`,
            error,
        );
        throw error;
    }
}

/**
 * Get digest statistics for monitoring
 */
export async function getDigestStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const stats = await prisma.campaignDigest.aggregate({
        where: {
            date: today,
        },
        _count: {
            id: true,
        },
    });

    const sentDigests = await prisma.campaignDigest.count({
        where: {
            date: today,
            sent: true,
        },
    });

    const pendingDigests = await prisma.campaignDigest.count({
        where: {
            date: today,
            sent: false,
        },
    });

    return {
        totalDigests: stats._count.id,
        sentDigests,
        pendingDigests,
    };
}
