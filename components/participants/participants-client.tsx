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
import { deleteParticipant, getParticipants } from '@/actions/participant';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ParticipantsTable } from '@/components/participants/participants-table';
import { ActionState } from '@/auth/middleware';
import { User } from '@/types/user';
import { BloodGroup } from '@/types/enums';
import { PaginationControls } from '@/components/custom/pagination-controls';

interface ParticipantsClientProps {
    currentPage: number;
    currentSearch: string;
    currentBloodGroup: BloodGroup | null;
    currentRegion?: string;
    currentCityId?: string;
}

const PAGE_SIZE = 10;

export default function ParticipantsClient({
    currentPage,
    currentSearch,
    currentBloodGroup,
    currentRegion,
    currentCityId,
}: ParticipantsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [participants, setParticipants] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [deleteState, deleteAction, deletePending] = useActionState<
        ActionState,
        FormData
    >(deleteParticipant, { error: '', success: '' });

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

    useEffect(() => {
        if (deleteState.success) {
            toast({
                title: 'Success',
                description: deleteState.success,
            });
            loadParticipants();
        } else if (deleteState.error) {
            toast({
                title: 'Error',
                description: deleteState.error,
                variant: 'destructive',
            });
        }
    }, [deleteState, toast]);

    const loadParticipants = async () => {
        setIsLoading(true);
        try {
            const result = await getParticipants({
                page: currentPage,
                pageSize: PAGE_SIZE,
                search: currentSearch,
                bloodGroup: currentBloodGroup || undefined,
                region: currentRegion || undefined,
                cityId: currentCityId || undefined,
            });

            if (result) {
                setParticipants(result.participants as User[]);
                setTotalCount(result.totalCount);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: `Failed to load participants: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const handleDelete = async (participantId: string) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', participantId);
            await deleteAction(formData);
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Participants</CardTitle>
                <CardDescription>
                    {totalCount} total participants found
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ParticipantsTable
                    participants={participants}
                    onEditParticipant={(participantId: string) => {
                        router.push(
                            `/dashboard/participants/edit/${participantId}`,
                        );
                    }}
                    onDeleteParticipant={handleDelete}
                    isLoading={isLoading || deletePending}
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
