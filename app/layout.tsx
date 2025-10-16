import type { Metadata } from 'next';
import { Nunito, Tajawal } from 'next/font/google';
import './globals.css';
import { Organization, WithContext } from 'schema-dts';
import { cookies, headers } from 'next/headers';
import { getDictionary } from '@/i18n/get-dictionary';
import { i18n } from '@/i18n/i18n-config';
import { cn } from '@/lib/utils';
import { NavigationProgress } from '@/components/custom/navigation-progress';
import { NavigationProvider } from '@/components/custom/navigation-events';
import { GoogleAnalytics } from '@next/third-parties/google';
import { FirebaseAnalytics } from '@/components/custom/firebase-analytics';

const nunitoFont = Nunito({
    subsets: ['latin'],
    display: 'swap',
});

const tajawal = Tajawal({
    weight: ['200', '300', '400', '500', '700', '800', '900'],
    variable: '--font-tajawal',
    subsets: ['arabic'],
    display: 'swap',
    fallback: ['nunito', 'sans-serif'],
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
const gaId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const isProduction = process.env.NODE_ENV === 'production';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');

    const preferredLocale =
        acceptLanguage
            ?.split(',')
            .map(lang => {
                const [l, q = '1'] = lang.split(';q=');
                return { lang: l.split('-')[0], q: parseFloat(q) };
            })
            .sort((a, b) => b.q - a.q)
            .find(({ lang }) => ['fr', 'ar', 'en'].includes(lang))?.lang ||
        i18n.defaultLocale;

    const locale = cookieStore.get('NEXT_LOCALE')?.value || preferredLocale;

    const dictionary = await getDictionary();

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: dictionary.metadata.defaultTitle,
            template: dictionary.metadata.template,
        },
        description: dictionary.metadata.description,
        openGraph: {
            title: dictionary.metadata.ogTitle,
            description: dictionary.metadata.ogDescription,
            siteName: 'tabarro3',
            url: baseUrl,
            images: [
                {
                    url: `${baseUrl}/api/og`,
                    width: 1200,
                    height: 630,
                    alt: dictionary.metadata.ogImageAlt,
                },
            ],
            locale:
                locale === 'ar' ? 'ar_MA' : locale === 'fr' ? 'fr_MA' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dictionary.metadata.twitterTitle,
            description: dictionary.metadata.twitterDescription,
            images: [
                {
                    url: `${baseUrl}/api/og`,
                    height: 630,
                    alt: dictionary.metadata.twitterImageAlt,
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        keywords: dictionary.metadata.keywords,
    };
}

const getJsonLd = async (): Promise<WithContext<Organization>> => {
    const dictionary = await getDictionary();

    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'tabarro3.ma',
        description: dictionary.metadata.jsonLdDescription,
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            availableLanguage: ['English', 'Arabic', 'French'],
        },
        sameAs: [
            'https://www.facebook.com/tabarro3maroc/',
            'https://www.instagram.com/tabarro3_ma/',
            'https://x.com/tabarro3_ma',
        ],
    };
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || i18n.defaultLocale;
    const isRTL = locale === 'ar';
    const jsonLd = await getJsonLd();

    return (
        <html
            lang={locale}
            dir={isRTL ? 'rtl' : 'ltr'}
            suppressHydrationWarning
            className={cn(
                'antialiased transition-all',
                isRTL
                    ? [
                          tajawal.className,
                          tajawal.variable,
                          'text-right',
                          // '[&_*]:text-right',
                      ]
                    : [nunitoFont.className, 'text-left'],
            )}>
            <head>
                <link rel="canonical" href={baseUrl} />
                <script
                    id="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            {isProduction && gaId ? <GoogleAnalytics gaId={gaId} /> : null}
            {isProduction ? <FirebaseAnalytics /> : null}
            <body className="antialiased bg-gray-50">
                <NavigationProvider>
                    <NavigationProgress />
                    {children}
                </NavigationProvider>
            </body>
        </html>
    );
}
