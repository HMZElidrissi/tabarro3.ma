'use server';

import { z } from 'zod';
import { validatedAction, validatedActionWithUser } from '@/auth/middleware';
import { comparePasswords, hashPassword } from '@/auth/session';
import { getClientInfo } from '@/lib/ip';
import { logActivity } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { ActivityType } from '@/types/enums';
import rateLimit from '@/lib/rate-limit';
import { nanoid } from 'nanoid';
import { sendPasswordChangedEmail, sendPasswordResetEmail } from '@/lib/mail';
import { getDictionary } from '@/i18n/get-dictionary';

const updatePasswordSchema = z
    .object({
        currentPassword: z.string().min(8).max(100),
        newPassword: z.string().min(8).max(100),
        confirmPassword: z.string().min(8).max(100),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

const resetPasswordSchema = z
    .object({
        token: z.string(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8),
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

const passwordResetLimiter = rateLimit({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 500,
});

export const updatePassword = validatedActionWithUser(
    updatePasswordSchema,
    async (data, _, user) => {
        const { currentPassword, newPassword } = data;
        const dict = await getDictionary();

        const isPasswordValid = await comparePasswords(
            currentPassword,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            return { error: dict.auth.updatePassword.currentPasswordIncorrect };
        }

        if (currentPassword === newPassword) {
            return {
                error: dict.auth.updatePassword.newPasswordMustBeDifferent,
            };
        }

        const newPasswordHash = await hashPassword(newPassword);
        const clientInfo = await getClientInfo();
        const ipAddress = clientInfo?.basic?.ip || 'Unknown';

        await Promise.all([
            prisma.user.update({
                where: { id: user.id },
                data: { passwordHash: newPasswordHash },
            }),
            logActivity(user.id, ActivityType.UPDATE_PASSWORD, ipAddress),
        ]);

        return { success: dict.auth.updatePassword.passwordUpdatedSuccess };
    },
);

export const forgotPassword = validatedAction(
    forgotPasswordSchema,
    async data => {
        const { email } = data;
        const ipAddress = (await getClientInfo()).basic.ip;
        const dict = await getDictionary();

        // Check rate limit (3 attempts per hour per IP)
        const rateLimitResult = passwordResetLimiter.check(ipAddress, 3);

        if (!rateLimitResult.success) {
            const minutes = Math.ceil(
                (rateLimitResult.retryAfter ?? 60000) / 1000 / 60,
            );
            return {
                error: dict.auth.forgotPassword.tooManyAttempts.replace(
                    '{minutes}',
                    minutes.toString(),
                ),
            };
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: {
                email,
                deletedAt: null, // Only allow reset for active users
            },
        });

        if (!user) {
            // Don't reveal if user exists or not for security
            return {
                success: dict.auth.forgotPassword.resetInstructionsSent,
            };
        }

        // Delete any existing unused tokens for this user
        await prisma.passwordReset.deleteMany({
            where: {
                userId: user.id,
                used: false,
            },
        });

        // Generate new reset token
        const token = nanoid(32);
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token expires in 1 hour

        // Create password reset record
        await prisma.passwordReset.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        await sendPasswordResetEmail(email, token);

        // Log activity
        await logActivity(
            user.id,
            ActivityType.PASSWORD_RESET_REQUEST,
            ipAddress,
        );

        return {
            success: dict.auth.forgotPassword.resetInstructionsSent,
        };
    },
);

export const resetPassword = validatedAction(
    resetPasswordSchema,
    async data => {
        const { token, password } = data;
        const dict = await getDictionary();

        // Find valid reset token
        const resetRequest = await prisma.passwordReset.findFirst({
            where: {
                token,
                used: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            include: {
                user: true,
            },
        });

        if (!resetRequest) {
            return {
                error: dict.auth.forgotPassword.invalidOrExpiredLink,
            };
        }

        // Hash new password
        const passwordHash = await hashPassword(password);

        // Update password and mark token as used in a transaction
        await prisma.$transaction(async tx => {
            await tx.user.update({
                where: { id: resetRequest.userId },
                data: { passwordHash },
            });

            await tx.passwordReset.update({
                where: { id: resetRequest.id },
                data: { used: true },
            });
        });

        // Log activity
        const ipAddress = (await getClientInfo()).basic.ip;
        await logActivity(
            resetRequest.userId,
            ActivityType.PASSWORD_RESET_COMPLETE,
            ipAddress,
        );

        await sendPasswordChangedEmail(resetRequest.user.email);

        return {
            success: dict.auth.forgotPassword.passwordResetSuccess,
        };
    },
);
