'use client';

import { BloodRequest } from '@/types/blood-request';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    CalendarClock,
    CheckCircle,
    Droplets,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Trash2,
} from 'lucide-react';
import { InboxIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { getBloodGroupLabel } from '@/config/blood-group';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { deleteBloodRequest, markAsFulfilled } from '@/actions/profile';
import { useToast } from '@/hooks/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ActionState } from '@/auth/middleware';
import { useRouter } from 'next/navigation';
import { ProgressLink as Link } from '@/components/custom/progress-link';
import { getStatusColor } from '@/lib/utils';
import { getLocation } from '@/config/locations';

interface BloodRequestsGridProps {
    initialRequests: BloodRequest[];
    dict: any;
    isRTL?: boolean;
}

export function BloodRequestsGrid({
    initialRequests,
    dict,
    isRTL,
}: BloodRequestsGridProps) {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(
        null,
    );
    const { toast } = useToast();

    const [state, deleteAction, pending] = useActionState<
        ActionState,
        FormData
    >(deleteBloodRequest, { error: '', success: '' });

    const [fulfillState, fulfillAction, fulfillPending] = useActionState<
        ActionState,
        FormData
    >(markAsFulfilled, { error: '', success: '' });

    useEffect(() => {
        if (state.success) {
            toast({
                title: dict.common.success,
                description: state.success,
            });
            setDeleteDialogOpen(false);
            router.refresh();
        } else if (state.error) {
            toast({
                title: dict.common.error,
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast, router, dict]);

    useEffect(() => {
        if (fulfillState.success) {
            toast({
                title: dict.common.success,
                description: fulfillState.success,
            });
            router.refresh();
        } else if (fulfillState.error) {
            toast({
                title: dict.common.error,
                description: fulfillState.error,
                variant: 'destructive',
            });
        }
    }, [fulfillState, toast, router, dict]);

    const handleDelete = async (request: BloodRequest) => {
        const formData = new FormData();
        formData.append('id', request.id.toString());
        startTransition(async () => {
            await deleteAction(formData);
        });
    };

    const handleMarkAsFulfilled = async (request: BloodRequest) => {
        const formData = new FormData();
        formData.append('id', request.id.toString());
        startTransition(async () => {
            await fulfillAction(formData);
        });
    };

    return (
        <>
            <div className="mb-6 flex justify-between items-center">
                <h2 className="text-xl font-semibold">
                    {dict.bloodRequests.myRequests}
                </h2>
                <Link href="/profile/requests/new">
                    <Button variant="secondary">
                        <Plus className="mr-2 h-4 w-4" />
                        {dict.bloodRequests.newRequest}
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {initialRequests.map(request => (
                    <Card key={request.id} className="relative overflow-hidden">
                        <div
                            className={`absolute top-0 left-0 right-0 h-1 ${getStatusColor(request.status)}`}
                        />
                        <CardHeader className="space-y-1">
                            <div className="flex justify-between items-start">
                                <Badge
                                    variant="outline"
                                    className={`${getStatusColor(request.status)}`}
                                >
                                    {
                                        dict.bloodRequests.status[
                                            request.status.toLowerCase()
                                        ]
                                    }
                                </Badge>
                                <div className="flex gap-2">
                                    {request.status !== 'fulfilled' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleMarkAsFulfilled(request)
                                            }
                                            disabled={fulfillPending}
                                            title={
                                                dict.bloodRequests
                                                    .markAsFulfilled
                                            }
                                        >
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </Button>
                                    )}
                                    <Link
                                        href={`/profile/requests/${request.id}`}
                                    >
                                        <Button variant="ghost" size="sm">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedRequest(request);
                                            setDeleteDialogOpen(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                                <Droplets className="h-5 w-5" />
                                {getBloodGroupLabel(
                                    request.bloodGroup,
                                    dict,
                                    'request',
                                )}
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span className="font-medium">
                                        {
                                            getLocation(request.city.id, isRTL)
                                                ?.regionName
                                        }
                                    </span>
                                    <span className="text-muted-foreground/50">
                                        •
                                    </span>
                                    <span>
                                        {
                                            getLocation(request.city.id, isRTL)
                                                ?.cityName
                                        }
                                    </span>
                                </div>
                                {request.location && (
                                    <div className="flex items-center gap-2">
                                        <InboxIcon className="h-4 w-4" />
                                        {request.location}
                                    </div>
                                )}
                                {request.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        {request.phone}
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <CalendarClock className="h-4 w-4" />
                                    {format(
                                        new Date(request.createdAt),
                                        'dd-MM-yyyy',
                                    )}
                                </div>
                            </div>
                            {request.description && (
                                <p className="text-sm mt-2">
                                    {request.description}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}

                {initialRequests.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {dict.bloodRequests.noRequests}
                    </div>
                )}
            </div>

            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dict.bloodRequests.deleteDialog.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict.bloodRequests.deleteDialog.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {dict.common.cancel}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                selectedRequest && handleDelete(selectedRequest)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={pending}
                        >
                            {pending
                                ? dict.common.deleting
                                : dict.common.delete}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
