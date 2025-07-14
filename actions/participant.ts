'use server';

import { prisma } from '@/lib/prisma';
import { validatedActionWithUser } from '@/auth/middleware';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { BloodGroup, Role } from '@/types/enums';
import { hashPassword } from '@/auth/session';

const ParticipantSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    bloodGroup: z
        .enum([
            'A_POSITIVE',
            'A_NEGATIVE',
            'B_POSITIVE',
            'B_NEGATIVE',
            'O_POSITIVE',
            'O_NEGATIVE',
            'AB_POSITIVE',
            'AB_NEGATIVE',
            'UNKNOWN',
        ])
        .optional()
        .nullable(),
    cityId: z.coerce.number().optional().nullable(),
});

interface GetParticipantsParams {
    page: number;
    pageSize: number;
    search?: string;
    bloodGroup?: BloodGroup | 'all';
    region?: string;
    cityId?: string;
}

export async function getParticipants({
    page,
    pageSize,
    search = '',
    bloodGroup,
    region,
    cityId,
}: GetParticipantsParams) {
    const where: any = {
        role: Role.PARTICIPANT,
        OR: search
            ? [
                  { name: { contains: search, mode: 'insensitive' as const } },
                  {
                      city: {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                  },
              ]
            : undefined,
        bloodGroup: bloodGroup && bloodGroup !== 'all' ? bloodGroup : undefined,
    };
    if (cityId) {
        where.cityId = Number(cityId);
    } else if (region) {
        where.city = { ...where.city, regionId: Number(region) };
    }

    const [participants, totalCount] = await Promise.all([
        prisma.user.findMany({
            where,
            skip: (page - 1) * pageSize,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                bloodGroup: true,
                city: { select: { id: true, name: true } },
                createdAt: true,
                updatedAt: true,
            },
            take: pageSize,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({ where }),
    ]);

    return { participants, totalCount };
}

export const getParticipant = async (id: string) => {
    const participant = prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            bloodGroup: true,
            city: { select: { id: true, name: true, regionId: true } },
            cityId: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    if (!participant) {
        return null;
    }

    return participant;
};

export const createParticipant = validatedActionWithUser(
    ParticipantSchema,
    async (data, _, user) => {
        if (user.role !== 'ADMIN') {
            return { error: 'Not authorized' };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            return { error: 'Participant with this email already exists' };
        }

        try {
            await prisma.user.create({
                data: {
                    ...data,
                    role: 'PARTICIPANT',
                    passwordHash: await hashPassword(data.email),
                },
            });
            revalidatePath('/dashboard/participants');
            return { success: 'Participant created successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to create participant',
            };
        }
    },
);

export const updateParticipant = validatedActionWithUser(
    ParticipantSchema.extend({ id: z.string() }),
    async (data, _, user) => {
        if (user.role !== 'ADMIN') {
            return { error: 'Not authorized' };
        }

        try {
            const { id, ...updateData } = data;
            await prisma.user.update({
                where: { id },
                data: updateData,
            });
            revalidatePath('/dashboard/participants');
            return { success: 'Participant updated successfully' };
        } catch (error) {
            return {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to update participant',
            };
        }
    },
);

export const deleteParticipant = validatedActionWithUser(
    z.object({ id: z.string() }),
    async (data, _, user) => {
        if (user.role !== 'ADMIN') {
            return { error: 'Not authorized' };
        }

        try {
            await prisma.user.delete({ where: { id: data.id } });
            revalidatePath('/dashboard/participants');
            return { success: 'Participant deleted successfully' };
        } catch (error) {
            return {
                error: 'Failed to delete participant',
            };
        }
    },
);
