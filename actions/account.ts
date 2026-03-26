'use server';

import { z } from 'zod';
import { validatedActionWithUser } from '@/auth/middleware';
import { getClientInfo } from '@/lib/ip';
import { logActivity } from '@/lib/utils';
import { ActivityType } from '@/types/enums';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// No payload needed — confirmation is handled client-side (typed word check)
const deleteAccountSchema = z.object({});

const NOTIFICATION_LANGUAGES = ['fr', 'en', 'ar'] as const;

const updateAccountSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email('Invalid email address'),
    notificationLanguage: z.enum(NOTIFICATION_LANGUAGES).optional(),
});

export const deleteAccount = validatedActionWithUser(
    deleteAccountSchema,
    async (_data, __, user) => {
        const clientInfo = await getClientInfo();
        const ipAddress = clientInfo?.basic?.ip || 'Unknown';

        await logActivity(user.id, ActivityType.DELETE_ACCOUNT, ipAddress);

        // Soft delete
        await prisma.user.update({
            where: { id: user.id },
            data: {
                deletedAt: new Date(),
                email: `${user.email}-${user.id}-deleted`, // Ensure email uniqueness
                emailVerifiedAt: null, // Clear verification state on deletion
            },
        });

        (await cookies()).delete('session');
        redirect('/sign-in');
    },
);

export const updateAccount = validatedActionWithUser(
    updateAccountSchema,
    async (data, _, user) => {
        const { name, email, notificationLanguage } = data;
        const ipAddress = (await getClientInfo()).basic.ip;

        const updateData: {
            name: string;
            email: string;
            notificationLanguage?: string;
        } = {
            name,
            email,
        };
        if (notificationLanguage != null) {
            updateData.notificationLanguage = notificationLanguage;
        }

        await Promise.all([
            prisma.user.update({
                where: { id: user.id },
                data: updateData,
            }),
            logActivity(user.id, ActivityType.UPDATE_ACCOUNT, ipAddress),
        ]);

        return {
            success:
                'Account updated successfully, changes will reflect when you refresh the page.',
        };
    },
);
