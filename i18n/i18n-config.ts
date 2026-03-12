export const i18n = {
    defaultLocale: 'ar',
    locales: ['fr', 'ar', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export function isValidLocale(locale: string | undefined): locale is Locale {
    return locale
        ? (i18n.locales as readonly string[]).includes(locale)
        : false;
}

/** Resolve to a valid locale (e.g. for emails where locale is explicit, not from request). */
export function getResolvedLocale(
    value: string | null | undefined,
): Locale {
    return value != null && isValidLocale(value) ? value : i18n.defaultLocale;
}
