import { BenefitsComponent } from '@/components/home/benefits';
import CriteriasComponent from '@/components/home/criterias';
import HeroComponent from '@/components/home/hero';
import MapComponent from '@/components/home/map';
import HowItWorksComponent from '@/components/home/how-it-works';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import Partners from '@/components/home/partners';
import LatestBlogPosts from '@/components/blog/latest-blog-posts';
import { Metadata } from 'next';
import { WithContext } from 'schema-dts';
import Script from 'next/script';
import { SEOOptimizer } from '@/components/custom/seo-optimizer';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    const lang = await getLocale();

    return {
        title: dict.metadata.defaultTitle,
        description: dict.metadata.description,
        keywords: dict.metadata.keywords,
        openGraph: {
            title: dict.metadata.ogTitle,
            description: dict.metadata.ogDescription,
            url: baseUrl,
            siteName: 'tabarro3',
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: dict.metadata.ogImageAlt,
                },
            ],
            locale: lang === 'ar' ? 'ar_MA' : lang === 'fr' ? 'fr_MA' : 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: dict.metadata.twitterTitle,
            description: dict.metadata.twitterDescription,
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: dict.metadata.twitterImageAlt,
                },
            ],
        },
        alternates: {
            canonical: baseUrl,
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
    };
}

const getHomePageJsonLd = async (): Promise<WithContext<any>> => {
    const dict = await getDictionary();

    return {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: 'tabarro3 - Blood Donation Platform',
        description: dict.metadata.description,
        url: baseUrl,
        mainEntity: {
            '@type': 'Organization',
            name: 'tabarro3',
            description: dict.metadata.jsonLdDescription,
            url: baseUrl,
            logo: `${baseUrl}/logo.png`,
            contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                availableLanguage: ['English', 'Arabic', 'French'],
            },
            sameAs: [
                'https://www.linkedin.com/company/rotaract-les-merinides/',
                'https://www.instagram.com/rotaract_les_merinides/',
            ],
        },
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: baseUrl,
                },
            ],
        },
    };
};

export default async function Page() {
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';
    const jsonLd = await getHomePageJsonLd();

    return (
        <>
            <Script
                id="homepage-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <SEOOptimizer
                pageType="home"
                locale={lang}
                structuredData={jsonLd}
            />
            <div className="-mt-8">
                <HeroComponent dict={dict} isRTL={isRTL} />
                <HowItWorksComponent dict={dict} />
                <LatestBlogPosts locale={lang} dictionary={dict} />
                <Partners dict={dict} />
                <BenefitsComponent dict={dict} />
                <CriteriasComponent dict={dict} />
                <MapComponent dict={dict} />
            </div>
        </>
    );
}
