'use server';

import { z } from 'zod';
import { validatedAction } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/mail';
import { getDictionary } from '@/i18n/get-dictionary';
import { nanoid } from 'nanoid';

const resendSchema = z.object({
    email: z.string().email().min(3).max(255),
});

export const resendVerification = validatedAction(resendSchema, async data => {
    const { email } = data;
    const dict = await getDictionary();

    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive',
            },
            deletedAt: null,
        },
    });

    // Always return the same success message to prevent email enumeration
    if (!user) {
        return { success: dict.auth.verifyEmail.resendSuccess };
    }

    // If already verified, return a specific message
    if (user.emailVerifiedAt) {
        return { success: dict.auth.verifyEmail.alreadyVerified };
    }

    // Invalidate old pending tokens for this user
    await prisma.emailVerification.updateMany({
        where: {
            userId: user.id,
            used: false,
        },
        data: {
            used: true,
        },
    });

    // Create a fresh token
    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await prisma.emailVerification.create({
        data: {
            userId: user.id,
            token,
            expiresAt,
        },
    });

    try {
        await sendVerificationEmail(email, token, user.notificationLanguage);
    } catch (error) {
        console.error('Error resending verification email:', error);
        return { error: dict.auth.verifyEmail.resendFailed };
    }

    return { success: dict.auth.verifyEmail.resendSuccess };
});
