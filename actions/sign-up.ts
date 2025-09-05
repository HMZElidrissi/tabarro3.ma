'use server';

import { z } from 'zod';
import { validatedAction } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { hashPassword, setSession } from '@/auth/session';
import { getClientInfo } from '@/lib/ip';
import {
    logActivity,
    isValidMoroccanPhone,
    normalizeMoroccanPhone,
} from '@/lib/utils';
import { ActivityType, BloodGroup } from '@/types/enums';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/i18n/get-dictionary';

const signUpSchema = z.object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
    name: z.string().max(100),
    phone: z.string().max(20).optional(),
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    cityId: z.coerce.number().int().positive().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
    const dict = await getDictionary();

    // Re-validate phone with internationalized message
    if (data.phone && !isValidMoroccanPhone(data.phone)) {
        return { error: dict.signUp.invalidPhoneNumber };
    }

    const {
        email,
        password,
        confirmPassword,
        name,
        phone,
        bloodGroup,
        cityId,
    } = data;

    if (password !== confirmPassword) {
        return { error: dict.signUp.passwordsDoNotMatch };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: dict.signUp.userAlreadyExists };
    }

    const passwordHash = await hashPassword(password);

    const clientInfo = await getClientInfo();
    const ipAddress = clientInfo?.basic?.ip || 'Unknown';

    const user = await prisma.user.create({
        data: {
            email,
            passwordHash,
            name,
            phone: phone ? normalizeMoroccanPhone(phone) : phone,
            bloodGroup,
            cityId,
        },
    });

    await Promise.all([
        setSession(user),
        logActivity(user.id, ActivityType.SIGN_UP, ipAddress),
    ]);

    redirect('/dashboard');
});
