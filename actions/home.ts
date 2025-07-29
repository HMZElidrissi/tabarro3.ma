'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getBloodRequests(page: number = 1, limit: number = 9) {
    try {
        const skip = (page - 1) * limit;

        const [requests, total] = await Promise.all([
            prisma.bloodRequest.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                        },
                    },
                    city: {
                        select: {
                            id: true,
                            regionId: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.bloodRequest.count(),
        ]);

        return {
            requests,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error('Error fetching blood requests:', error);
        throw new Error('Failed to fetch blood requests');
    }
}

export async function getCampaigns(
    page: number = 1,
    limit: number = 9,
    filters?: { regionId?: string; cityId?: string },
) {
    try {
        const where: any = {};

        if (filters?.regionId) {
            where.city = { regionId: Number(filters.regionId) };
        }
        if (filters?.cityId) {
            where.cityId = Number(filters.cityId);
        }

        // Get all campaigns first to sort them properly
        const allCampaigns = await prisma.campaign.findMany({
            where,
            include: {
                city: {
                    include: {
                        region: true,
                    },
                },
                organization: {
                    select: {
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                startTime: 'asc',
            },
        });

        const now = new Date();

        // Sort campaigns by priority: ongoing first, then upcoming, then past
        const sortedCampaigns = allCampaigns.sort((a, b) => {
            const aStart = new Date(a.startTime);
            const aEnd = new Date(a.endTime);
            const bStart = new Date(b.startTime);
            const bEnd = new Date(b.endTime);

            const aIsOngoing = aStart <= now && aEnd >= now;
            const bIsOngoing = bStart <= now && bEnd >= now;
            const aIsUpcoming = aStart > now;
            const bIsUpcoming = bStart > now;

            // Ongoing campaigns first
            if (aIsOngoing && !bIsOngoing) return -1;
            if (!aIsOngoing && bIsOngoing) return 1;

            // Then upcoming campaigns
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;

            // Within each category, sort by start time
            return aStart.getTime() - bStart.getTime();
        });

        const total = sortedCampaigns.length;
        const totalPages = Math.ceil(total / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const campaigns = sortedCampaigns.slice(startIndex, endIndex);

        return {
            campaigns,
            total,
            totalPages,
            currentPage: page,
        };
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw error;
    }
}

export async function participateInCampaign(
    campaignId: number,
    userId: string,
) {
    try {
        await prisma.campaignParticipant.create({
            data: {
                campaignId: campaignId,
                userId: userId,
            },
        });

        revalidatePath('/campaigns');
        return { success: true };
    } catch (error) {
        console.error('Error participating in campaign:', error);
        throw new Error('Failed to participate in campaign');
    }
}
