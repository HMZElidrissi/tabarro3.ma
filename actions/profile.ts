'use server';

import { prisma } from '@/lib/prisma';
import { validatedActionWithUser } from '@/auth/middleware';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { BloodGroup } from '@/types/enums';
import { queueBloodRequestNotification } from '@/jobs/helpers';
import { isValidMoroccanPhone, normalizeMoroccanPhone } from '@/lib/utils';
import { getDictionary } from '@/i18n/get-dictionary';

const ProfileSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone number is required'),
    bloodGroup: z.nativeEnum(BloodGroup).nullable(),
    cityId: z.coerce.number().nullable(),
});

export const updateProfile = validatedActionWithUser(
    ProfileSchema,
    async (data, _, user) => {
        try {
            const dict = await getDictionary();

            // Validate phone with internationalized message
            if (!isValidMoroccanPhone(data.phone)) {
                return { error: dict.signUp.invalidPhoneNumber };
            }

            // Check if the user exists
            const existingUser = await prisma.user.findUnique({
                where: { id: user.id },
                select: { id: true, role: true },
            });

            if (!existingUser) {
                return { error: 'User not found' };
            }

            // Update user profile
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    phone: normalizeMoroccanPhone(data.phone),
                    bloodGroup: data.bloodGroup,
                    cityId: data.cityId,
                    updatedAt: new Date(),
                },
            });

            // Revalidate relevant paths
            revalidatePath('/profile');

            return { success: 'Profile updated successfully' };
        } catch (error) {
            console.error('Profile update error:', error);
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update profile',
            };
        }
    },
);

export const getProfile = async (userId: string) => {
    return prisma.user.findUnique({
        where: {
            id: userId,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bloodGroup: true,
            city: {
                select: {
                    id: true,
                    name: true,
                    regionId: true,
                },
            },
            cityId: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
};

const BloodRequestSchema = z.object({
    userId: z.string(),
    bloodGroup: z.nativeEnum(BloodGroup),
    cityId: z.coerce.number(),
    location: z.string().min(1),
    phone: z.string().min(1),
    description: z.string().optional(),
    status: z.string().optional(),
});

export const getBloodRequests = async (userId: string) => {
    return prisma.bloodRequest.findMany({
        where: {
            userId,
        },
        include: {
            city: {
                select: {
                    id: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
};

export const getBloodRequest = async (id: number) => {
    return prisma.bloodRequest.findUnique({
        where: { id },
        include: {
            city: {
                select: {
                    id: true,
                    name: true,
                    regionId: true,
                },
            },
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    bloodGroup: true,
                    city: {
                        select: {
                            id: true,
                            name: true,
                            regionId: true,
                        },
                    },
                },
            },
        },
    });
};

export const createBloodRequest = validatedActionWithUser(
    BloodRequestSchema,
    async (data, _, user) => {
        if (user.id !== data.userId) {
            return { error: 'Not authorized' };
        }

        try {
            const newRequest = await prisma.bloodRequest.create({
                data: {
                    ...data,
                    description: data.description || '',
                    status: 'active',
                },
            });

            await queueBloodRequestNotification(newRequest.id);

            revalidatePath('/profile');
            return { success: 'Blood request created successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create blood request',
            };
        }
    },
);

export const updateBloodRequest = validatedActionWithUser(
    BloodRequestSchema.extend({
        id: z.coerce.number(),
    }),
    async (data, _, user) => {
        if (user.id !== data.userId) {
            return { error: 'Not authorized' };
        }

        try {
            const request = await prisma.bloodRequest.findUnique({
                where: { id: data.id },
            });

            if (!request) {
                return { error: 'Blood request not found' };
            }

            if (request.userId !== user.id) {
                return { error: 'Not authorized to update this request' };
            }

            const { id, ...updateData } = data;

            await prisma.bloodRequest.update({
                where: { id },
                data: updateData,
            });

            revalidatePath('/profile');
            return { success: 'Blood request updated successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update blood request',
            };
        }
    },
);

export const deleteBloodRequest = validatedActionWithUser(
    z.object({ id: z.coerce.number() }),
    async (data, _, user) => {
        try {
            const request = await prisma.bloodRequest.findUnique({
                where: { id: data.id },
            });

            if (!request) {
                return { error: 'Blood request not found' };
            }

            if (request.userId !== user.id) {
                return { error: 'Not authorized to delete this request' };
            }

            await prisma.bloodRequest.delete({
                where: { id: data.id },
            });

            revalidatePath('/profile');
            return { success: 'Blood request deleted successfully' };
        } catch (error) {
            return {
                error: 'Failed to delete blood request',
            };
        }
    },
);

export const markAsFulfilled = validatedActionWithUser(
    z.object({ id: z.coerce.number() }),
    async (data, _, user) => {
        try {
            const request = await prisma.bloodRequest.findUnique({
                where: { id: data.id },
            });

            if (!request) {
                return { error: 'Blood request not found' };
            }

            if (request.userId !== user.id && user.role !== 'ADMIN') {
                return { error: 'Not authorized to update this request' };
            }

            if (request.status === 'fulfilled') {
                return { error: 'Blood request is already fulfilled' };
            }

            await prisma.bloodRequest.update({
                where: { id: data.id },
                data: {
                    status: 'fulfilled',
                    updatedAt: new Date(),
                },
            });

            revalidatePath('/profile');
            return {
                success: 'Blood request marked as fulfilled successfully',
            };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to mark blood request as fulfilled',
            };
        }
    },
);
