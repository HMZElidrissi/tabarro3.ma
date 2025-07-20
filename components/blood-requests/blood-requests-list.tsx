'use client';

import { BloodRequestCard } from '@/components/blood-requests/blood-request-card';
import { BloodRequest } from '@/types/blood-request';
import { PaginationControls } from '@/components/custom/pagination-controls';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface BloodRequestsListProps {
    requests: BloodRequest[];
    dict: any;
    totalPages: number;
    currentPage: number;
    total: number;
}

export default function BloodRequestsList({
    requests,
    dict,
    totalPages,
    currentPage,
    total,
}: BloodRequestsListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isClient, setIsClient] = useState(false);

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
                <div className="text-center mb-10 relative">
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-10">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-brand-600">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                        {dict.Blood_Requests}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                        {dict.Blood_Requests_Description}
                    </p>

                    <div className="mt-4 w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <BloodRequestCard
                            key={request.id}
                            request={request}
                            dict={dict}
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
