import 'server-only';
import { i18n, getResolvedLocale } from './i18n-config';
import { cookies } from 'next/headers';

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then(module => module.default),
    ar: () => import('@/dictionaries/ar.json').then(module => module.default),
    fr: () => import('@/dictionaries/fr.json').then(module => module.default),
} as const;

export const getDictionary = async () => {
    const locale = await getLocale();

    if (!locale || !(locale in dictionaries)) {
        console.warn(`Locale '${locale}' not supported, falling back to 'ar'`);
        return dictionaries.ar();
    }
    return dictionaries[locale as keyof typeof dictionaries]();
};

/** Load the full dictionary for a given locale (e.g. for emails, where locale is explicit). */
export async function getDictionaryForLocale(locale: string | null | undefined) {
    const loc = getResolvedLocale(locale);
    if (!(loc in dictionaries)) {
        return dictionaries.ar();
    }
    return dictionaries[loc as keyof typeof dictionaries]();
}

export const getLocale = async () => {
    const cookieStore = await cookies();
    return cookieStore.get('NEXT_LOCALE')?.value || i18n.defaultLocale;
};
