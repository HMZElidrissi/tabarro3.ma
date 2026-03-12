'use server';

import { z } from 'zod';
import { validatedAction } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { comparePasswords, setSession } from '@/auth/session';
import { getClientInfo } from '@/lib/ip';
import { logActivity } from '@/lib/utils';
import { ActivityType, Role } from '@/types/enums';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/i18n/get-dictionary';

const signInSchema = z.object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async data => {
    const { email, password } = data;
    const dict = await getDictionary();

    // Look up user in a case-insensitive way to avoid email casing issues
    const user = await prisma.user.findFirst({
        where: {
            email: {
                equals: email,
                mode: 'insensitive',
            },
        },
    });

    if (!user) {
        return { error: dict.signIn.invalidCredentials };
    }

    const isPasswordValid = await comparePasswords(password, user.passwordHash);

    if (!isPasswordValid) {
        return { error: dict.signIn.invalidCredentials };
    }

    const hasVerificationFlow = await prisma.emailVerification.count({
        where: { userId: user.id },
    });

    if (hasVerificationFlow > 0 && !user.emailVerifiedAt) {
        return redirect(`/verify-email?email=${encodeURIComponent(email)}`);
    }

    const clientInfo = await getClientInfo();
    const ipAddress = clientInfo?.basic?.ip || 'Unknown';

    await Promise.all([
        setSession(user),
        logActivity(user.id, ActivityType.SIGN_IN, ipAddress),
    ]);

    if (user.role === Role.PARTICIPANT) {
        return redirect('/profile');
    }

    return redirect('/dashboard');
});
