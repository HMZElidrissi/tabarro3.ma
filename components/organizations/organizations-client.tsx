'use client';

import { DashboardShell } from '@/components/dashboard/shell';
import { InviteOrganizationDialog } from '@/components/organizations/invite-organization-dialog';
import { OrganizationsTable } from '@/components/organizations/organizations-table';
import { InvitationsTable } from '@/components/organizations/invitations-table';
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

export default function OrganizationsClient() {
    const [organizations, setOrganizations] = useState<User[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

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

    const loadData = async () => {
        startTransition(async () => {
            try {
                const [organizationsResult, invitationsResult] =
                    await Promise.all([
                        getOrganizations({}, new FormData()),
                        getPendingInvitations({}, new FormData()),
                    ]);

                if ('organizations' in organizationsResult) {
                    setOrganizations(
                        organizationsResult.organizations as User[],
                    );
                }

                if (invitationsResult.invitations) {
                    setInvitations(
                        invitationsResult.invitations as Invitation[],
                    );
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load team data',
                    variant: 'destructive',
                });
            }
        });
    };

    // Load initial data
    useEffect(() => {
        loadData();
    }, [updateRoleState, removeOrganizationState]);

    // Handle successful invite
    const handleInviteSuccess = () => {
        loadData();
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
            header="Organizations"
            description="Manage our partners and pending invitations."
            toolbar={
                <InviteOrganizationDialog
                    onInviteSuccess={handleInviteSuccess}
                />
            }
        >
            <Tabs defaultValue="organizations" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="organizations">
                        Organizations
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
                            <CardTitle>Organizations</CardTitle>
                            <CardDescription>
                                View and manage partners of tabarro3.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OrganizationsTable
                                organizations={organizations}
                                onUpdateRole={handleUpdateRole}
                                onRemoveOrganization={handleRemoveOrganization}
                                isLoading={
                                    isPending ||
                                    updateRolePending ||
                                    removeOrganizationPending
                                }
                            />
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
