'use client';

import { startTransition, useActionState, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { deleteCampaign, getCampaigns } from '@/actions/campaign';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { CampaignsTable } from '@/components/campaigns/campaigns-table';
import { ActionState } from '@/auth/middleware';
import { Campaign } from '@/types/campaign';
import { Role } from '@/types/enums';
import { PaginationControls } from '@/components/custom/pagination-controls';

interface CampaignsClientProps {
    currentPage: number;
    currentSearch: string;
    currentStatus: string;
    userRole: Role;
    organizationId?: string;
    currentRegion?: string;
    currentCityId?: string;
}

const PAGE_SIZE = 10;

export default function CampaignsClient({
    currentPage,
    currentSearch,
    currentStatus,
    userRole,
    organizationId,
    currentRegion,
    currentCityId,
}: CampaignsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [deleteState, deleteAction, deletePending] = useActionState<
        ActionState,
        FormData
    >(deleteCampaign, { error: '', success: '' });

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

    // Load campaigns with filters
    useEffect(() => {
        loadCampaigns();
    }, [
        currentPage,
        currentSearch,
        currentStatus,
        organizationId,
        currentRegion,
        currentCityId,
    ]);

    useEffect(() => {
        if (deleteState.success) {
            toast({
                title: 'Success',
                description: deleteState.success,
            });
            loadCampaigns();
        } else if (deleteState.error) {
            toast({
                title: 'Error',
                description: deleteState.error,
                variant: 'destructive',
            });
        }
    }, [deleteState, toast]);

    const loadCampaigns = async () => {
        setIsLoading(true);
        try {
            const result = await getCampaigns({
                page: currentPage,
                pageSize: PAGE_SIZE,
                search: currentSearch,
                status: currentStatus as
                    | 'upcoming'
                    | 'ongoing'
                    | 'completed'
                    | undefined,
                organizationId,
                region: currentRegion || undefined,
                cityId: currentCityId || undefined,
            });

            if (result) {
                setCampaigns(result.campaigns as Campaign[]);
                setTotalCount(result.totalCount);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to load campaigns: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const handleDelete = async (campaignId: number) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', campaignId.toString());
            await deleteAction(formData);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>
                    {totalCount} total campaigns found
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CampaignsTable
                    campaigns={campaigns}
                    userRole={userRole}
                    onEditCampaign={(campaignId: number) => {
                        router.push(`/dashboard/campaigns/edit/${campaignId}`);
                    }}
                    onDeleteCampaign={handleDelete}
                    isLoading={isLoading}
                    isDeleting={deletePending}
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
