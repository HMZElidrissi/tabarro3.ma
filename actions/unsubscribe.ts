'use server';

import { prisma } from '@/lib/prisma';
import { validatedAction } from '@/auth/middleware';
import { z } from 'zod';
import { verifyUnsubscribeToken } from '@/lib/unsubscribe';
import { NotificationType } from '@prisma/client';
import { getDictionary } from '@/i18n/get-dictionary';
import { getUser } from '@/auth/session';

const UnsubscribeSchema = z.object({
    token: z.string(),
    reason: z
        .string()
        .max(1000)
        .optional()
        .transform(value => value?.trim() || ''),
});

export const submitUnsubscribe = validatedAction(
    UnsubscribeSchema,
    async data => {
        const dict = await getDictionary();
        const t = dict.unsubscribe;

        const payload = await verifyUnsubscribeToken(data.token);

        if (!payload) {
            return {
                error: t?.errorInvalidLink ?? 'Lien de désabonnement invalide ou expiré.',
            };
        }

        const { email, type } = payload;

        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        const reason = data.reason || '';

        await prisma.$transaction(async tx => {
            if (user) {
                await tx.user.update({
                    where: { id: user.id },
                    data:
                        type === 'CAMPAIGN_DIGEST'
                            ? { receiveCampaignDigests: false }
                            : { receiveBloodRequestEmails: false },
                });
            }

            await tx.unsubscribeFeedback.create({
                data: {
                    email,
                    userId: user?.id ?? null,
                    type: type as NotificationType,
                    reason: reason || null,
                },
            });
        });

        const successMessage =
            type === 'CAMPAIGN_DIGEST'
                ? (t?.successDigest ?? 'Vous ne recevrez plus les résumés de campagnes.')
                : (t?.successBloodRequest ?? "Vous ne recevrez plus les demandes urgentes de sang.");

        return { success: successMessage };
    },
);

/** Dashboard: list unsubscribe feedback (admin only), paginated and optional type filter. */
export async function getUnsubscribeFeedbackList(
    page: number,
    pageSize: number,
    type?: NotificationType | 'all',
) {
    const user = await getUser();
    if (!user || user.role !== 'ADMIN') {
        return { error: 'Unauthorized', items: [], totalCount: 0 };
    }

    const where =
        type && type !== 'all' ? { type: type as NotificationType } : {};

    const [items, totalCount] = await Promise.all([
        prisma.unsubscribeFeedback.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.unsubscribeFeedback.count({ where }),
    ]);

    return {
        items: items.map(f => ({
            id: f.id,
            email: f.email,
            userId: f.userId,
            type: f.type,
            reason: f.reason,
            createdAt: f.createdAt,
        })),
        totalCount,
    };
}

