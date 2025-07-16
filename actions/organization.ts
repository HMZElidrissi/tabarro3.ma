'use server';

import { z } from 'zod';
import { validatedActionWithUser } from '@/auth/middleware';
import { Role } from '@/types/enums';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

const updateOrganizationRoleSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum([Role.ADMIN, Role.ORGANIZATION]),
});

const removeOrganizationSchema = z.object({
    userId: z.string().uuid(),
});

const getOrganizationsSchema = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
    search: z.string().optional(),
    region: z.string().optional(),
    cityId: z.string().optional(),
    role: z.string().optional(),
});

export const getOrganizations = validatedActionWithUser(
    getOrganizationsSchema,
    async (data, __, user) => {
        if (user.role !== Role.ADMIN) {
            return { error: 'Not authorized' };
        }

        const { page, pageSize, search, region, cityId, role } = data;

        const where: any = {
            deletedAt: null,
            role:
                role && role !== 'all'
                    ? (role as Role)
                    : {
                          in: [Role.ORGANIZATION, Role.ADMIN],
                      },
            OR: search
                ? [
                      {
                          name: {
                              contains: search,
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          email: {
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
                  ]
                : undefined,
        };

        if (cityId) {
            where.cityId = Number(cityId);
        } else if (region) {
            where.city = { ...where.city, regionId: Number(region) };
        }

        const [organizations, totalCount] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    city: {
                        select: {
                            id: true,
                            name: true,
                            region: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    createdAt: true,
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.user.count({ where }),
        ]);

        return { organizations, totalCount };
    },
);

export const getPendingInvitations = validatedActionWithUser(
    z.object({}),
    async (_, __, user) => {
        if (user.role !== Role.ADMIN) {
            return { error: 'Not authorized' };
        }

        const invitations = await prisma.invitation.findMany({
            where: {
                status: 'pending',
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                inviter: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                invitedAt: 'desc',
            },
        });

        return { invitations };
    },
);

export const updateOrganizationRole = validatedActionWithUser(
    updateOrganizationRoleSchema,
    async (data, _, user) => {
        if (user.role !== Role.ADMIN) {
            return { error: 'Not authorized' };
        }

        const { userId, role } = data;

        // Prevent admin from changing their own role
        if (userId === user.id) {
            return { error: 'Cannot change your own role' };
        }

        await prisma.user.update({
            where: { id: userId },
            data: { role },
        });

        revalidatePath('/dashboard/organizations');
        return { success: 'Role updated successfully' };
    },
);

export const removeOrganization = validatedActionWithUser(
    removeOrganizationSchema,
    async (data, _, user) => {
        if (user.role !== Role.ADMIN) {
            return { error: 'Not authorized' };
        }

        const { userId } = data;

        // Prevent admin from removing themselves
        if (userId === user.id) {
            return { error: 'Cannot remove yourself' };
        }

        // Soft delete the user
        await prisma.user.update({
            where: { id: userId },
            data: {
                deletedAt: new Date(),
                email: `${user.email}-${user.id}-deleted`, // Ensure email uniqueness
            },
        });

        revalidatePath('/dashboard/organizations');
        return { success: 'Organization removed successfully' };
    },
);

/**
 * Returns all organizations (role ORGANIZATION or ADMIN) without pagination.
 * Only accessible by ADMIN users.
 */
export const getAllOrganizations = validatedActionWithUser(
    z.object({}),
    async (_, __, user) => {
        if (user.role !== Role.ADMIN) {
            return { error: 'Not authorized' };
        }
        const organizations = await prisma.user.findMany({
            where: {
                deletedAt: null,
                role: Role.ORGANIZATION,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                city: {
                    select: {
                        id: true,
                        name: true,
                        region: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return { organizations };
    },
);
