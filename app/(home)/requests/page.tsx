import { Suspense } from 'react';
import BloodRequestsList from '@/components/blood-requests/blood-requests-list';
import { CardsLoading } from '@/components/loading/cards-loading';
import { getBloodRequests } from '@/actions/home';
import { BloodRequest } from '@/types/blood-request';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { Metadata } from 'next';

interface RequestsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
    const dict = await getDictionary();
    return {
        title: dict.Blood_Requests,
        description: dict.Blood_Requests,
        keywords: [
            'Demandes de don de sang',
            'Don de sang au Maroc',
            'Demandes de don de sang',
            'Don de sang',
            'Demandes de don de sang au Maroc',
            'Don de sang au Maroc',
            'Demandes de don de sang',
            'Don de sang',
        ],
        openGraph: {
            title: dict.Blood_Requests,
            description: dict.Blood_Requests,
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent("Demandes de don de sang")}&description=${encodeURIComponent("Découvrez les demandes de don de sang au Maroc")}`,
                    width: 1200,
                    height: 630,
                    alt: 'Demandes de don de sang',
                },
            ],
        },
        twitter: {
            title: dict.Blood_Requests,
            description: dict.Blood_Requests,
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent("Demandes de don de sang")}&description=${encodeURIComponent("Découvrez les demandes de don de sang au Maroc")}`,
                    width: 1200,
                    height: 630,
                    alt: 'Demandes de don de sang',
                },
            ],
        },
        alternates: {
            canonical: `${baseUrl}/requests`,
        },
    };
}

export default async function BloodRequestsPage({
    searchParams,
}: RequestsPageProps) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page) : 1;
    const requestsData = await getBloodRequests(page, 9);
    const dict = await getDictionary();
    const lang = await getLocale();

    return (
        <main>
            <Suspense fallback={<CardsLoading />}>
                <BloodRequestsList
                    requests={requestsData.requests as BloodRequest[]}
                    dict={dict}
                    lang={lang}
                    totalPages={requestsData.totalPages}
                    currentPage={requestsData.currentPage}
                    total={requestsData.total}
                />
            </Suspense>
        </main>
    );
}
