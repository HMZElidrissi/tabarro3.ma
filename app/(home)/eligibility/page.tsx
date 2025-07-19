import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { Metadata } from 'next';
import Script from 'next/script';
import { WithContext } from 'schema-dts';
import { EligibilityComponent } from '@/components/home/eligibility';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    const lang = await getLocale();

    return {
        title:
            dict.eligibility?.title || 'Eligibility Criteria - Blood Donation',
        description:
            dict.eligibility?.description ||
            'Learn about the eligibility criteria and requirements for blood donation in Morocco.',
        keywords: [
            'blood donation eligibility',
            'who can donate blood',
            'blood donation requirements',
            'Morocco blood donation',
            'donation criteria',
            'medical requirements',
            'health screening',
        ],
        openGraph: {
            title: dict.eligibility?.title || 'Blood Donation Eligibility',
            description:
                dict.eligibility?.description ||
                'Comprehensive guide to blood donation eligibility criteria',
            url: `${baseUrl}/eligibility`,
            siteName: 'tabarro3',
            images: [
                {
                    url: `${baseUrl}/og-image.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Blood Donation Eligibility - tabarro3',
                },
            ],
            locale: lang === 'ar' ? 'ar_MA' : lang === 'fr' ? 'fr_MA' : 'en_US',
            type: 'article',
        },
        alternates: {
            canonical: `${baseUrl}/eligibility`,
        },
    };
}

const getEligibilityJsonLd = async (): Promise<WithContext<any>> => {
    const dict = await getDictionary();

    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'Blood Donation Eligibility Criteria',
        description:
            dict.eligibility?.description ||
            'Complete guide to blood donation eligibility requirements',
        url: `${baseUrl}/eligibility`,
        author: {
            '@type': 'Organization',
            name: 'tabarro3',
        },
        publisher: {
            '@type': 'Organization',
            name: 'tabarro3',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/eligibility`,
        },
    };
};

export default async function EligibilityPage() {
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';
    const jsonLd = await getEligibilityJsonLd();

    return (
        <>
            <Script
                id="eligibility-json-ld"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="bg-gradient-to-b from-white to-gray-50">
                <EligibilityComponent dict={dict} isRTL={isRTL} />
            </div>
        </>
    );
}
