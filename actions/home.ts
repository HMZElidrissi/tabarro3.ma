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
                            name: true,
                            regionId: true,
                            region: {
                                select: {
                                    name: true,
                                },
                            },
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

export async function getCampaigns(page: number = 1, limit: number = 9) {
    try {
        const skip = (page - 1) * limit;

        const [campaigns, total] = await Promise.all([
            prisma.campaign.findMany({
                include: {
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
                    startTime: 'desc',
                },
                skip,
                take: limit,
            }),
            prisma.campaign.count(),
        ]);

        return {
            campaigns,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        };
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        throw new Error('Failed to fetch campaigns');
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
