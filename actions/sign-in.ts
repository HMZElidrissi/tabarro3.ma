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

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: dict.signIn.invalidCredentials };
    }

    const isPasswordValid = await comparePasswords(password, user.passwordHash);

    if (!isPasswordValid) {
        return { error: dict.signIn.invalidCredentials };
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
