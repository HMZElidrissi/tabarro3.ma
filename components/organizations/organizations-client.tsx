'use client';

import { DashboardShell } from '@/components/dashboard/shell';
import { InviteOrganizationDialog } from '@/components/organizations/invite-organization-dialog';
import { OrganizationsTable } from '@/components/organizations/organizations-table';
import { InvitationsTable } from '@/components/organizations/invitations-table';
import { OrganizationFilters } from '@/components/organizations/organization-filters';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Role } from '@/types/enums';
import { Invitation } from '@/types/invitation';
import { User } from '@/types/user';
import {
    getPendingInvitations,
    getOrganizations,
    removeOrganization,
    updateOrganizationRole,
} from '@/actions/organization';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { ActionState } from '@/auth/middleware';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PaginationControls } from '@/components/custom/pagination-controls';

interface OrganizationsClientProps {
    currentPage: number;
    currentSearch: string;
    currentRegion?: string;
    currentCityId?: string;
    currentRole?: string;
}

const PAGE_SIZE = 10;

export default function OrganizationsClient({
    currentPage,
    currentSearch,
    currentRegion,
    currentCityId,
    currentRole,
}: OrganizationsClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [organizations, setOrganizations] = useState<User[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

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

    const [updateRoleState, updateRoleAction, updateRolePending] =
        useActionState<ActionState, FormData>(updateOrganizationRole, {
            error: '',
        });

    const [
        removeOrganizationState,
        removeOrganizationAction,
        removeOrganizationPending,
    ] = useActionState<ActionState, FormData>(removeOrganization, {
        error: '',
    });

    const loadOrganizations = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('page', currentPage.toString());
            formData.append('pageSize', PAGE_SIZE.toString());
            if (currentSearch) formData.append('search', currentSearch);
            if (currentRegion) formData.append('region', currentRegion);
            if (currentCityId) formData.append('cityId', currentCityId);
            if (currentRole && currentRole !== 'all')
                formData.append('role', currentRole);

            const result = await getOrganizations({}, formData);

            if ('organizations' in result) {
                setOrganizations(result.organizations as User[]);
                setTotalCount(result.totalCount || 0);
            }
        } catch (error) {
            console.error('Error loading organizations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load organizations',
                variant: 'destructive',
            });
        }
        setIsLoading(false);
    };

    const loadInvitations = async () => {
        try {
            const result = await getPendingInvitations({}, new FormData());
            if (result.invitations) {
                setInvitations(result.invitations as Invitation[]);
            }
        } catch (error) {
            console.error('Error loading invitations:', error);
            toast({
                title: 'Error',
                description: 'Failed to load invitations',
                variant: 'destructive',
            });
        }
    };

    // Load organizations with filters
    useEffect(() => {
        loadOrganizations();
    }, [currentPage, currentSearch, currentRegion, currentCityId, currentRole]);

    // Load invitations
    useEffect(() => {
        loadInvitations();
    }, []);

    // Reload data after actions
    useEffect(() => {
        if (updateRoleState.success || removeOrganizationState.success) {
            loadOrganizations();
        }
    }, [updateRoleState.success, removeOrganizationState.success]);

    // Handle successful invite
    const handleInviteSuccess = () => {
        loadInvitations();
    };

    // Action handlers
    const handleUpdateRole = async (userId: string, role: Role) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('userId', userId.toString());
            formData.append('role', role);
            await updateRoleAction(formData);
        });
    };

    const handleRemoveOrganization = async (userId: string) => {
        startTransition(async () => {
            const formData = new FormData();
            formData.append('userId', userId.toString());
            await removeOrganizationAction(formData);
        });
    };

    // Toast notifications for different states
    useEffect(() => {
        if (updateRoleState.error) {
            toast({
                title: 'Error',
                description: updateRoleState.error,
                variant: 'destructive',
            });
        } else if (updateRoleState.success) {
            toast({
                title: 'Success',
                description: updateRoleState.success,
            });
        }
    }, [updateRoleState, toast]);

    useEffect(() => {
        if (removeOrganizationState.error) {
            toast({
                title: 'Error',
                description: removeOrganizationState.error,
                variant: 'destructive',
            });
        } else if (removeOrganizationState.success) {
            toast({
                title: 'Success',
                description: removeOrganizationState.success,
            });
        }
    }, [removeOrganizationState, toast]);

    return (
        <DashboardShell
            header="Organizations & Admins"
            description="Manage our partners, admins, and pending invitations."
            toolbar={
                <InviteOrganizationDialog
                    onInviteSuccess={handleInviteSuccess}
                />
            }
        >
            <Tabs defaultValue="organizations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="organizations">
                        Organizations & Admins
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        Pending Invitations
                        {invitations.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {invitations.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="organizations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organizations & Admins</CardTitle>
                            <CardDescription>
                                {totalCount} total organizations and admins
                                found
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrganizationFilters />
                            <div className="mt-6">
                                <OrganizationsTable
                                    organizations={organizations}
                                    onUpdateRole={handleUpdateRole}
                                    onRemoveOrganization={
                                        handleRemoveOrganization
                                    }
                                    isLoading={
                                        isLoading ||
                                        updateRolePending ||
                                        removeOrganizationPending
                                    }
                                />

                                {totalPages > 1 && (
                                    <div className="mt-4 flex justify-center">
                                        <PaginationControls
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="pending">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Invitations</CardTitle>
                            <CardDescription>
                                View and manage pending invitations.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <InvitationsTable invitations={invitations} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </DashboardShell>
    );
}
