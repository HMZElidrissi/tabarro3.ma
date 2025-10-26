'use server';

import { prisma } from '@/lib/prisma';
import {
    validatedActionWithUser,
    validatedAction,
    ActionState,
} from '@/auth/middleware';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { Role } from '@/types/enums';
import { addCampaignToDigest } from '@/jobs/digest-helpers';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { hashPassword } from '@/auth/session';

function getRegionFromCityId(cityId: number): string | null {
    for (const region of REGIONS_AND_CITIES) {
        const city = region.cities.find(c => c.id === cityId);
        if (city) {
            return region.id.toString();
        }
    }
    return null;
}

const CampaignSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    organizationId: z.string(),
    cityId: z.coerce.number(),
    location: z.string().min(1),
    startTime: z.string().transform(str => new Date(str)),
    endTime: z.string().transform(str => new Date(str)),
});

interface GetCampaignsParams {
    page: number;
    pageSize: number;
    search?: string;
    organizationId?: string;
    status?: 'upcoming' | 'ongoing' | 'completed';
    region?: string;
    cityId?: string;
}

export async function getCampaigns({
    page,
    pageSize,
    search = '',
    organizationId,
    status,
    region,
    cityId,
}: GetCampaignsParams) {
    const now = new Date();

    const where: any = {
        AND: [
            search
                ? {
                      OR: [
                          {
                              name: {
                                  contains: search,
                                  mode: 'insensitive' as const,
                              },
                          },
                          {
                              description: {
                                  contains: search,
                                  mode: 'insensitive' as const,
                              },
                          },
                          {
                              city: {
                                  name: {
                                      contains: search,
                                      mode: 'insensitive' as const,
                                  },
                              },
                          },
                      ],
                  }
                : {},
            organizationId ? { organizationId } : {},
            status === 'upcoming'
                ? { startTime: { gt: now } }
                : status === 'ongoing'
                  ? {
                        AND: [
                            { startTime: { lte: now } },
                            { endTime: { gt: now } },
                        ],
                    }
                  : status === 'completed'
                    ? { endTime: { lt: now } }
                    : {},
        ],
    };
    if (cityId) {
        where.AND.push({ cityId: Number(cityId) });
    } else if (region) {
        where.AND.push({ city: { regionId: Number(region) } });
    }

    const [campaigns, totalCount] = await Promise.all([
        prisma.campaign.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { startTime: 'desc' },
            include: {
                organization: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                city: {
                    select: {
                        id: true,
                        name: true,
                        regionId: true,
                    },
                },
                participants: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        }),
        prisma.campaign.count({ where }),
    ]);

    return { campaigns, totalCount };
}

export const getCampaign = async (id: number) => {
    const campaign = await prisma.campaign.findUnique({
        where: { id },
        include: {
            organization: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            city: {
                select: {
                    id: true,
                    name: true,
                    regionId: true,
                },
            },
            participants: {
                select: {
                    id: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            bloodGroup: true,
                        },
                    },
                },
            },
        },
    });

    if (!campaign) {
        return null;
    }

    return campaign;
};

export const createCampaign = validatedActionWithUser(
    CampaignSchema,
    async (data, _, user) => {
        if (user.role !== Role.ADMIN && user.role !== Role.ORGANIZATION) {
            return { error: 'Not authorized' };
        }

        try {
            // If organization user, use their ID
            const organizationId =
                user.role === Role.ORGANIZATION ? user.id : data.organizationId;

            // Validate dates
            if (new Date(data.startTime) >= new Date(data.endTime)) {
                return { error: 'End time must be after start time' };
            }

            const newCampaign = await prisma.campaign.create({
                data: {
                    ...data,
                    organizationId,
                },
            });

            // Add to daily digest instead of immediate notification
            await addCampaignToDigest(newCampaign.id);

            // Revalidate campaign pages for ISR
            revalidatePath('/campaigns');

            // Revalidate region-specific campaign page
            const regionId = getRegionFromCityId(data.cityId);
            if (regionId) {
                revalidatePath(`/campaigns?region=${regionId}`);
                revalidatePath(
                    `/campaigns?region=${regionId}&city=${data.cityId}`,
                );
            }

            return { success: 'Campaign created successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create campaign',
            };
        }
    },
);

export const updateCampaign = validatedActionWithUser(
    CampaignSchema.extend({ id: z.coerce.number() }),
    async (data, _, user) => {
        if (user.role !== Role.ADMIN && user.role !== Role.ORGANIZATION) {
            return { error: 'Not authorized' };
        }

        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id: data.id },
            });

            if (!campaign) {
                return { error: 'Campaign not found' };
            }

            // Check if organization user is updating their own campaign
            if (
                user.role === Role.ORGANIZATION &&
                campaign.organizationId !== user.id
            ) {
                return { error: 'Not authorized to update this campaign' };
            }

            // Validate dates
            if (new Date(data.startTime) >= new Date(data.endTime)) {
                return { error: 'End time must be after start time' };
            }

            const { id, ...updateData } = data;

            // Get old region ID for revalidation
            const oldRegionId = getRegionFromCityId(campaign.cityId);

            await prisma.campaign.update({
                where: { id },
                data: updateData,
            });

            // Revalidate campaign pages for ISR
            revalidatePath('/campaigns');

            // Revalidate old region pages (in case city changed)
            if (oldRegionId) {
                revalidatePath(`/campaigns?region=${oldRegionId}`);
                revalidatePath(
                    `/campaigns?region=${oldRegionId}&city=${campaign.cityId}`,
                );
            }

            // Revalidate new region pages (if city changed)
            const newRegionId = getRegionFromCityId(data.cityId);
            if (newRegionId && newRegionId !== oldRegionId) {
                revalidatePath(`/campaigns?region=${newRegionId}`);
                revalidatePath(
                    `/campaigns?region=${newRegionId}&city=${data.cityId}`,
                );
            }

            return { success: 'Campaign updated successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update campaign',
            };
        }
    },
);

export const deleteCampaign = validatedActionWithUser(
    z.object({ id: z.coerce.number() }),
    async (data, _, user) => {
        if (user.role !== Role.ADMIN && user.role !== Role.ORGANIZATION) {
            return { error: 'Not authorized' };
        }

        try {
            const campaign = await prisma.campaign.findUnique({
                where: { id: data.id },
            });

            if (!campaign) {
                return { error: 'Campaign not found' };
            }

            // Check if organization user is deleting their own campaign
            if (
                user.role === Role.ORGANIZATION &&
                campaign.organizationId !== user.id
            ) {
                return { error: 'Not authorized to delete this campaign' };
            }

            // Check if campaign has started (only for non-owners)
            if (
                new Date(campaign.startTime) <= new Date() &&
                user.role !== Role.ADMIN &&
                campaign.organizationId !== user.id
            ) {
                return {
                    error: 'Cannot delete a campaign that has already started',
                };
            }

            // Get region ID for revalidation before deletion
            const regionId = getRegionFromCityId(campaign.cityId);

            await prisma.campaign.delete({
                where: { id: data.id },
            });

            // Revalidate campaign pages for ISR
            revalidatePath('/campaigns');

            // Revalidate region-specific campaign pages
            if (regionId) {
                revalidatePath(`/campaigns?region=${regionId}`);
                revalidatePath(
                    `/campaigns?region=${regionId}&city=${campaign.cityId}`,
                );
            }

            return { success: 'Campaign deleted successfully' };
        } catch (error) {
            return {
                error: 'Failed to delete campaign',
            };
        }
    },
);

const quickParticipateSchema = z.object({
    campaignId: z.coerce.number(),
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string(),
    bloodGroup: z.string(),
    cityId: z.coerce.number(),
});

export const quickParticipate = validatedAction(
    quickParticipateSchema,
    async (data, _): Promise<ActionState> => {
        const { campaignId, name, email, phone, bloodGroup, cityId } = data;

        try {
            // Check if user already exists with this email
            let user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                // Create user with email as password
                const passwordHash = hashPassword(email);
                user = await prisma.user.create({
                    data: {
                        email,
                        name,
                        passwordHash: await hashPassword(email),
                        phone,
                        bloodGroup: bloodGroup as any,
                        cityId,
                        role: 'PARTICIPANT',
                    },
                });
            }

            // Check if user is already participating
            const existingParticipation =
                await prisma.campaignParticipant.findUnique({
                    where: {
                        campaignId_userId: {
                            campaignId,
                            userId: user.id,
                        },
                    },
                });

            if (existingParticipation) {
                return {
                    error: 'You are already participating in this campaign',
                };
            }

            // Add user to campaign
            await prisma.campaignParticipant.create({
                data: {
                    campaignId,
                    userId: user.id,
                },
            });

            revalidatePath('/campaigns');
            return { success: 'Successfully participated in campaign!' };
        } catch (error) {
            console.error('Error in quick participate:', error);
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to participate in campaign',
            };
        }
    },
);
