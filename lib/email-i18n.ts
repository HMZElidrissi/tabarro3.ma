/**
 * Email notification translations loaded from dictionaries/emails/{locale}.json.
 * Used for all transactional and digest emails so recipients get content in their preferred language.
 */

export const NOTIFICATION_LOCALES = ['fr', 'en', 'ar'] as const;
export type NotificationLocale = (typeof NOTIFICATION_LOCALES)[number];

export function isValidNotificationLocale(
    value: string | null | undefined,
): value is NotificationLocale {
    return value != null && NOTIFICATION_LOCALES.includes(value as NotificationLocale);
}

export function getNotificationLocale(
    value: string | null | undefined,
): NotificationLocale {
    return isValidNotificationLocale(value) ? value : 'fr';
}

// ─── Translation types (must match dictionaries/emails/*.json) ─────────────

export interface EmailTranslations {
    verification: {
        subject: string;
        preview: string;
        title: string;
        bodyThanks: string;
        bodyConfirm: string;
        cta: string;
        securityNote: string;
    };
    passwordReset: {
        subject: string;
        preview: string;
        title: string;
        greeting: string;
        body: string;
        cta: string;
        expiryNote: string;
        ignoreNote: string;
        linkHint: string;
        footer: string;
    };
    passwordChanged: {
        subject: string;
        preview: string;
        title: string;
        greeting: string;
        body: string;
        contactNote: string;
        cta: string;
        footer: string;
    };
    invitation: {
        subject: string;
        preview: string;
        title: string;
        greeting: string;
        body: string;
        bullet1: string;
        bullet2: string;
        bullet3: string;
        cta: string;
        expiryNote: string;
        linkHint: string;
        footer: string;
    };
    campaignDigest: {
        subjectPrefix: string;
        title: string;
        dateLabel: string;
        intro: string;
        organizedBy: string;
        date: string;
        time: string;
        location: string;
        city: string;
        participate: string;
        tipsTitle: string;
        tip1: string;
        tip2: string;
        tip3: string;
        tip4: string;
        viewAll: string;
        footerReason: string;
        unsubscribe: string;
        unsubscribePrompt: string;
        autoSent: string;
        footer: string;
    };
    bloodRequest: {
        subjectPrefix: string;
        title: string;
        intro: string;
        detailsTitle: string;
        bloodGroup: string;
        location: string;
        city: string;
        contact: string;
        description: string;
        cta: string;
        shareNote: string;
        unsubscribe: string;
        unsubscribePrompt: string;
        autoSent: string;
        footer: string;
    };
    common: {
        copyright: string;
    };
}

const emailDictionaries = {
    fr: () => import('@/dictionaries/emails/fr.json').then(m => m.default as EmailTranslations),
    en: () => import('@/dictionaries/emails/en.json').then(m => m.default as EmailTranslations),
    ar: () => import('@/dictionaries/emails/ar.json').then(m => m.default as EmailTranslations),
} as const;

/** Load email translations for the given locale from JSON (dictionaries/emails/{locale}.json). */
export async function getEmailDictionary(
    locale: string | null | undefined,
): Promise<EmailTranslations> {
    const loc = getNotificationLocale(locale);
    return emailDictionaries[loc]();
}

export function replaceYear(str: string, year?: number): string {
    return str.replace('{year}', String(year ?? new Date().getFullYear()));
}
