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
import { deleteBloodRequest, getBloodRequests } from '@/actions/request';
import { markAsFulfilled } from '@/actions/profile';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BloodRequestsTable } from '@/components/requests/requests-table';
import { ActionState } from '@/auth/middleware';
import { BloodRequest } from '@/types/blood-request';
import { Role, BloodGroup } from '@/types/enums';
import { PaginationControls } from '@/components/custom/pagination-controls';

interface BloodRequestsClientProps {
    currentPage: number;
    currentSearch: string;
    currentStatus: string;
    currentBloodGroup?: BloodGroup;
    userRole: Role;
    currentRegion?: string;
    currentCityId?: string;
}

const PAGE_SIZE = 10;

export default function BloodRequestsClient({
    currentPage,
    currentSearch,
    currentStatus,
    currentBloodGroup,
    userRole,
    currentRegion,
    currentCityId,
}: BloodRequestsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [deleteState, deleteAction, deletePending] = useActionState<
        ActionState,
        FormData
    >(deleteBloodRequest, { error: '', success: '' });

    const [fulfillState, fulfillAction, fulfillPending] = useActionState<
        ActionState,
        FormData
    >(markAsFulfilled, { error: '', success: '' });

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

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

    const handlePageChange = (page: number) => {
        router.push(
            `${pathname}?${createQueryString({
                page: page.toString(),
            })}`,
        );
    };

    useEffect(() => {
        loadRequests();
    }, [
        currentPage,
        currentSearch,
        currentStatus,
        currentBloodGroup,
        currentRegion,
        currentCityId,
    ]);

    useEffect(() => {
        if (deleteState.success) {
            toast({
                title: 'Success',
                description: deleteState.success,
            });
            loadRequests();
        } else if (deleteState.error) {
            toast({
                title: 'Error',
                description: deleteState.error,
                variant: 'destructive',
            });
        }
    }, [deleteState, toast]);

    useEffect(() => {
        if (fulfillState.success) {
            toast({
                title: 'Success',
                description: fulfillState.success,
            });
            loadRequests();
        } else if (fulfillState.error) {
            toast({
                title: 'Error',
                description: fulfillState.error,
                variant: 'destructive',
            });
        }
    }, [fulfillState, toast]);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const result = await getBloodRequests({
                page: currentPage,
                pageSize: PAGE_SIZE,
                search: currentSearch,
                status: currentStatus || undefined,
                bloodGroup: currentBloodGroup,
                region: currentRegion || undefined,
                cityId: currentCityId || undefined,
            });

            if (result) {
                setRequests(result.requests as BloodRequest[]);
                setTotalCount(result.totalCount);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to load requests: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const handleDelete = async (requestId: number) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', requestId.toString());
            await deleteAction(formData);
        });
    };

    const handleMarkAsFulfilled = async (requestId: number) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', requestId.toString());
            await fulfillAction(formData);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Blood Requests</CardTitle>
                <CardDescription>
                    {totalCount} total requests found
                </CardDescription>
            </CardHeader>
            <CardContent>
                <BloodRequestsTable
                    requests={requests}
                    userRole={userRole}
                    onEditRequest={(requestId: number) => {
                        router.push(`/dashboard/requests/edit/${requestId}`);
                    }}
                    onDeleteRequest={handleDelete}
                    onMarkAsFulfilled={handleMarkAsFulfilled}
                    isLoading={isLoading}
                    isDeleting={deletePending}
                    isFulfilling={fulfillPending}
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
