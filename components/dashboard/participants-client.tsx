'use client';

import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getLatestCampaignParticipants } from '@/actions/dashboard';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { LatestCampaignParticipants } from '@/components/dashboard/latest-campaign-participants';
import { Role } from '@/types/enums';
import { PaginationControls } from '@/components/custom/pagination-controls';

interface ParticipantsClientProps {
    currentPage: number;
    currentSearch: string;
    currentBloodGroup: string;
    currentRegion?: string;
    currentCityId?: string;
    userRole: Role;
    userId: string;
}

const PAGE_SIZE = 10;

export default function ParticipantsClient({
    currentPage,
    currentSearch,
    currentBloodGroup,
    currentRegion,
    currentCityId,
    userRole,
    userId,
}: ParticipantsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [participants, setParticipants] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    // Create query string helper
    const createQueryString = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            if (!value) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        return newParams.toString();
    };

    // Handle page change
    const handlePageChange = (page: number) => {
        router.push(
            `${pathname}?${createQueryString({
                page: page.toString(),
            })}`,
        );
    };

    // Load participants with filters
    useEffect(() => {
        loadParticipants();
    }, [
        currentPage,
        currentSearch,
        currentBloodGroup,
        currentRegion,
        currentCityId,
    ]);

    async function loadParticipants() {
        setIsLoading(true);

        try {
            // Fetch all participants (we'll filter client-side for now)
            const data = await getLatestCampaignParticipants(
                userId,
                userRole,
                500, // Get more records for filtering
            );

            // Filter participants
            let filteredData = data;

            // Filter by search term
            if (currentSearch) {
                filteredData = filteredData.filter(
                    p =>
                        p.user.name
                            ?.toLowerCase()
                            .includes(currentSearch.toLowerCase()) ||
                        p.user.email
                            .toLowerCase()
                            .includes(currentSearch.toLowerCase()) ||
                        p.campaign.name
                            .toLowerCase()
                            .includes(currentSearch.toLowerCase()),
                );
            }

            // Filter by blood group
            if (currentBloodGroup && currentBloodGroup !== 'all') {
                filteredData = filteredData.filter(
                    p => p.user.bloodGroup === currentBloodGroup,
                );
            }

            // Filter by region
            if (currentRegion) {
                filteredData = filteredData.filter(
                    p => p.user.city?.regionId === Number(currentRegion),
                );
            }

            // Filter by city
            if (currentCityId) {
                filteredData = filteredData.filter(
                    p => p.user.city?.id === Number(currentCityId),
                );
            }

            // Paginate
            const startIndex = (currentPage - 1) * PAGE_SIZE;
            const endIndex = startIndex + PAGE_SIZE;
            const paginatedData = filteredData.slice(startIndex, endIndex);

            setTotalCount(filteredData.length);
            setParticipants(paginatedData as any);
        } catch (error) {
            console.error('Failed to load participants:', error);
            toast({
                title: 'Error',
                description: 'Failed to load participants',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaign Participants</CardTitle>
                <CardDescription>
                    {totalCount} total participants found
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LatestCampaignParticipants
                    participants={participants}
                    userRole={userRole}
                    isLoading={isLoading}
                />

                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <PaginationControls
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
