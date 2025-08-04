import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ActivityType } from '@/types/enums';
import { prisma } from '@/lib/prisma';
import { format, parseISO } from 'date-fns';
import { fr, enUS, ar, arMA } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export async function logActivity(
    userId: string,
    type: ActivityType,
    ipAddress?: string,
) {
    await prisma.activityLog.create({
        data: {
            userId,
            action: type,
            ipAddress: ipAddress || '',
        },
    });
}

export const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'bg-green-50 text-green-700 border-green-200';
        case 'fulfilled':
            return 'bg-gray-50 text-gray-700 border-gray-200';
        case 'cancelled':
            return 'bg-red-50 text-red-700 border-red-200';
        default:
            return 'bg-blue-50 text-blue-700 border-blue-200';
    }
};

export function formatDate(dateString: string, localeCode: string = 'fr') {
    const date = parseISO(dateString);

    const locales = {
        fr: fr,
        en: enUS,
        ar: arMA,
    };

    const locale = locales[localeCode as keyof typeof locales] || fr;

    return format(date, 'dd MMMM yyyy', { locale });
}

/**
 * Validates Moroccan phone numbers
 * Supports formats:
 * - 06XXXXXXXX (mobile)
 * - 05XXXXXXXX (mobile)
 * - 07XXXXXXXX (mobile)
 * - +212XXXXXXXXX (international format)
 * - 00212XXXXXXXXX (international format)
 * - XXXXXXXXX (9 digits starting with 5, 6, or 7)
 */
export function isValidMoroccanPhone(phone: string): boolean {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Moroccan phone number patterns
    const patterns = [
        // Local format: 06XXXXXXXX, 05XXXXXXXX, 07XXXXXXXX
        /^(0[567])\d{8}$/,
        // International format: +212XXXXXXXXX
        /^\+212[567]\d{8}$/,
        // International format: 00212XXXXXXXXX
        /^00212[567]\d{8}$/,
        // 9 digits starting with 5, 6, or 7
        /^[567]\d{8}$/,
    ];

    return patterns.some(pattern => pattern.test(cleaned));
}

/**
 * Normalizes Moroccan phone numbers to a standard format
 * Returns the number in international format (+212XXXXXXXXX)
 */
export function normalizeMoroccanPhone(phone: string): string {
    // Remove all non-digit characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // If it's already in international format with +
    if (cleaned.startsWith('+212')) {
        return cleaned;
    }

    // If it's in international format with 00
    if (cleaned.startsWith('00212')) {
        return '+' + cleaned.substring(2);
    }

    // If it's in local format (0XXXXXXXXX) and valid Moroccan number
    if (
        cleaned.startsWith('0') &&
        cleaned.length === 10 &&
        /^0[567]/.test(cleaned)
    ) {
        return '+212' + cleaned.substring(1);
    }

    // If it's just the number without country code (XXXXXXXXX)
    if (cleaned.length === 9 && /^[567]/.test(cleaned)) {
        return '+212' + cleaned;
    }

    // Return as is if no pattern matches
    return phone;
}
