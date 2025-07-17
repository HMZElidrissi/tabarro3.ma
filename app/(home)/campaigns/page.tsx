import { Suspense } from 'react';
import CampaignsList from '@/components/campaigns/campaigns-list';
import { getCampaigns } from '@/actions/home';
import { Campaign } from '@/types/campaign';
import { getUser } from '@/auth/session';
import { CardsLoading } from '@/components/loading/cards-loading';
import { getDictionary } from '@/i18n/get-dictionary';
import { Metadata } from 'next';
import { REGIONS_AND_CITIES } from '@/config/locations';

// Allow dynamic params for regions/cities not pre-generated
export const dynamicParams = true;

export async function generateStaticParams() {
    // Generate static params for all regions and a default "all" page
    const staticParams = [
        { region: undefined, city: undefined },
        ...REGIONS_AND_CITIES.map(region => ({
            region: region.id.toString(),
            city: undefined,
        })),
        // Also generate for popular region-city combinations
        ...REGIONS_AND_CITIES.flatMap(region =>
            region.cities.slice(0, 3).map(city => ({
                // Limit to top 3 cities per region
                region: region.id.toString(),
                city: city.id.toString(),
            })),
        ),
    ];

    return staticParams.map(params => ({
        searchParams: params,
    }));
}

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.New_Campaigns,
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
    const dict = await getDictionary();
    const user = await getUser();
    const authenticated = !!user;
    const userId = user?.id || '';

    return (
        <main className="container mx-auto py-8">
            <Suspense fallback={<CardsLoading />}>
                <CampaignsList
                    campaigns={campaignsData.campaigns as Campaign[]}
                    authenticated={authenticated}
                    userId={userId}
                    dict={dict}
                    totalPages={campaignsData.totalPages}
                    currentPage={campaignsData.currentPage}
                    total={campaignsData.total}
                />
            </Suspense>
        </main>
    );
}
