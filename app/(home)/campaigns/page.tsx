import { Suspense } from 'react';
import CampaignsList from '@/components/campaigns/campaigns-list';
import { getCampaigns } from '@/actions/home';
import { Campaign } from '@/types/campaign';
import { getUser } from '@/auth/session';
import { CardsLoading } from '@/components/loading/cards-loading';
import { getDictionary } from '@/i18n/get-dictionary';

export default async function CampaignsPage() {
    const campaigns = await getCampaigns();
    const dict = await getDictionary();
    const user = await getUser();
    const authenticated = !!user;
    const userId = user?.id || '';

    return (
        <main className="container mx-auto py-8">
            <Suspense fallback={<CardsLoading />}>
                <CampaignsList
                    campaigns={campaigns as Campaign[]}
                    authenticated={authenticated}
                    userId={userId}
                    dict={dict}
                />
            </Suspense>
        </main>
    );
}
