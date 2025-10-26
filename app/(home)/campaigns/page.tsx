import { Suspense } from 'react';
import CampaignsList from '@/components/campaigns/campaigns-list';
import { getCampaigns } from '@/actions/home';
import { Campaign } from '@/types/campaign';
import { getUser } from '@/auth/session';
import { CardsLoading } from '@/components/loading/cards-loading';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { Metadata } from 'next';
import { REGIONS_AND_CITIES } from '@/config/locations';

// Allow dynamic params for regions/cities not pre-generated
export const dynamicParams = true;

export async function generateStaticParams() {
    return [
        { searchParams: { region: undefined, city: undefined } }, // all
        ...REGIONS_AND_CITIES.map(region => ({
            searchParams: { region: region.id.toString(), city: undefined },
        })),
    ];
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
    const dict = await getDictionary();
    return {
        title: dict.New_Campaigns,
        description: dict.New_Campaigns_Description,
        keywords: [
            'Nouvelles campagnes de don de sang',
            'Campagnes de don de sang au Maroc',
            'Don de sang au Maroc',
            'Campagnes de don de sang',
        ],
        openGraph: {
            title: dict.New_Campaigns,
            description: dict.New_Campaigns,
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent('Nouvelles campagnes de don de sang')}&description=${encodeURIComponent('Découvrez les nouvelles campagnes de don de sang au Maroc')}`,
                    width: 1200,
                    height: 630,
                    alt: 'Nouvelles campagnes de don de sang',
                },
            ],
        },
        twitter: {
            title: dict.New_Campaigns,
            description: dict.New_Campaigns,
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent('Nouvelles campagnes de don de sang')}&description=${encodeURIComponent('Découvrez les nouvelles campagnes de don de sang au Maroc')}`,
                    width: 1200,
                    height: 630,
                    alt: 'Nouvelles campagnes de don de sang',
                },
            ],
        },
        alternates: {
            canonical: `${baseUrl}/campaigns`,
        },
    };
}

interface CampaignsPageProps {
    searchParams: Promise<{ page?: string; region?: string; city?: string }>;
}

export default async function CampaignsPage({
    searchParams,
}: CampaignsPageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const regionId = params.region || undefined;
    const cityId = params.city || undefined;

    const campaignsData = await getCampaigns(page, 9, { regionId, cityId });
    const campaigns = campaignsData.campaigns as Campaign[];
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';
    const user = await getUser();
    const authenticated = !!user;
    const userId = user?.id || '';

    return (
        <main className="container mx-auto py-8">
            <Suspense fallback={<CardsLoading />}>
                <CampaignsList
                    campaigns={campaigns}
                    authenticated={authenticated}
                    userId={userId}
                    dict={dict}
                    isRTL={isRTL}
                    totalPages={campaignsData.totalPages}
                    currentPage={campaignsData.currentPage}
                    total={campaignsData.total}
                />
            </Suspense>
        </main>
    );
}
