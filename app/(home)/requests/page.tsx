import { Suspense } from 'react';
import BloodRequestsList from '@/components/blood-requests/blood-requests-list';
import { CardsLoading } from '@/components/loading/cards-loading';
import { getBloodRequests } from '@/actions/home';
import { BloodRequest } from '@/types/blood-request';
import { getDictionary } from '@/i18n/get-dictionary';

interface RequestsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function BloodRequestsPage({
    searchParams,
}: RequestsPageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const requestsData = await getBloodRequests(page, 9);
    const dict = await getDictionary();

    return (
        <main>
            <Suspense fallback={<CardsLoading />}>
                <BloodRequestsList
                    requests={requestsData.requests as BloodRequest[]}
                    dict={dict}
                    totalPages={requestsData.totalPages}
                    currentPage={requestsData.currentPage}
                    total={requestsData.total}
                />
            </Suspense>
        </main>
    );
}
