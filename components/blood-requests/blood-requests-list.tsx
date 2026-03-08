'use client';

import { BloodRequestCard } from '@/components/blood-requests/blood-request-card';
import { BloodRequest } from '@/types/blood-request';
import { PaginationControls } from '@/components/custom/pagination-controls';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/custom/page-header';

interface BloodRequestsListProps {
    requests: BloodRequest[];
    dict: any;
    lang: string;
    totalPages: number;
    currentPage: number;
    total: number;
}

export default function BloodRequestsList({
    requests,
    dict,
    lang,
    totalPages,
}: BloodRequestsListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);
    const isRTL = lang === 'ar';

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div className="container mx-auto py-16">
            <div className="space-y-6">
                <PageHeader
                    title={dict.Blood_Requests}
                    description={dict.Blood_Requests_Description}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <BloodRequestCard
                            key={request.id}
                            request={request}
                            dict={dict}
                            isRTL={isRTL}
                            lang={lang}
                        />
                    ))}
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <PaginationControls
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            dict={dict}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
