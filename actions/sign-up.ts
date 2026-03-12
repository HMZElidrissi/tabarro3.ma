'use server';

import { z } from 'zod';
import { validatedAction } from '@/auth/middleware';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/auth/session';
import { getClientInfo } from '@/lib/ip';
import {
    logActivity,
    isValidMoroccanPhone,
    normalizeMoroccanPhone,
} from '@/lib/utils';
import { ActivityType, BloodGroup } from '@/types/enums';
import { redirect } from 'next/navigation';
import { getDictionary } from '@/i18n/get-dictionary';
import { nanoid } from 'nanoid';
import { sendVerificationEmail } from '@/lib/mail';
import { REGIONS_AND_CITIES } from '@/config/locations';

const NOTIFICATION_LANGUAGES = ['fr', 'en', 'ar'] as const;

const signUpSchema = z.object({
    email: z.string().email().min(3).max(255),
    password: z.string().min(8).max(100),
    confirmPassword: z.string().min(8).max(100),
    name: z.string().max(100),
    phone: z.string().max(20).optional(),
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    cityId: z.coerce.number().int().positive().optional(),
    notificationLanguage: z.enum(NOTIFICATION_LANGUAGES).optional(),
});

function getSafeSignUpPayload(data: z.infer<typeof signUpSchema>) {
    const { email, name, phone, bloodGroup, cityId, notificationLanguage } =
        data;
    const regionId = cityId
        ? REGIONS_AND_CITIES.find(r => r.cities.some(c => c.id === cityId))?.id
        : undefined;
    return {
        email,
        name,
        phone: phone ?? '',
        bloodGroup: bloodGroup ?? '',
        cityId: cityId != null ? String(cityId) : '',
        region: regionId != null ? String(regionId) : '',
        notificationLanguage: notificationLanguage ?? 'fr',
    };
}

export const signUp = validatedAction(signUpSchema, async (data, formData) => {
    const dict = await getDictionary();

    // Re-validate phone with internationalized message
    if (data.phone && !isValidMoroccanPhone(data.phone)) {
        return {
            error: dict.signUp.invalidPhoneNumber,
            ...getSafeSignUpPayload(data),
        };
    }

    const {
        email,
        password,
        confirmPassword,
        name,
        phone,
        bloodGroup,
        cityId,
        notificationLanguage,
    } = data;

    if (password !== confirmPassword) {
        return {
            error: dict.signUp.passwordsDoNotMatch,
            ...getSafeSignUpPayload(data),
        };
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return {
            error: dict.signUp.userAlreadyExists,
            ...getSafeSignUpPayload(data),
        };
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
            notificationLanguage: notificationLanguage ?? 'fr',
        },
    });

    const token = nanoid(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    try {
        await prisma.emailVerification.create({
            data: {
                userId: user.id,
                token,
                expiresAt,
            },
        });

        await sendVerificationEmail(email, token, user.notificationLanguage);
    } catch (error) {
        console.error('Error creating email verification:', error);
        return {
            error: dict.signUp.verificationEmailFailed,
            ...getSafeSignUpPayload(data),
        };
    }

    await logActivity(user.id, ActivityType.SIGN_UP, ipAddress);

    redirect('/sign-in?verification=sent');
});
