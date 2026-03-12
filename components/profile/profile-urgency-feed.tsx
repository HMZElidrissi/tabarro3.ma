'use client';

import { BloodRequest } from '@/types/blood-request';
import { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    AlertTriangle,
    CalendarClock,
    CheckCircle,
    Droplets,
    MapPin,
    Pencil,
    Phone,
    Plus,
    Trash2,
    UserCog,
} from 'lucide-react';
import { format } from 'date-fns';
import { getBloodGroupLabel } from '@/config/blood-group';
import { getLocation } from '@/config/locations';
import { cn, getStatusColor } from '@/lib/utils';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { deleteBloodRequest, markAsFulfilled } from '@/actions/profile';
import { useToast } from '@/hooks/use-toast';
import { ActionState } from '@/auth/middleware';
import { useRouter } from 'next/navigation';
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
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { AccountForm } from '@/components/profile/account-form';
import { RequestForm } from '@/components/profile/request-form';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ProfileUrgencyFeedProps {
    user: User;
    bloodRequests: BloodRequest[];
    dict: any;
    isRTL?: boolean;
}

const URGENCY_GRADIENTS: Record<string, string> = {
    active: 'from-brand-600 to-brand-800',
    fulfilled: 'from-emerald-500 to-emerald-700',
    expired: 'from-slate-400 to-slate-600',
};

const BLOOD_BG: Record<string, string> = {
    'A+': 'bg-rose-50 dark:bg-rose-950',
    'A-': 'bg-rose-50 dark:bg-rose-950',
    'B+': 'bg-orange-50 dark:bg-orange-950',
    'B-': 'bg-orange-50 dark:bg-orange-950',
    'AB+': 'bg-purple-50 dark:bg-purple-950',
    'AB-': 'bg-purple-50 dark:bg-purple-950',
    'O+': 'bg-brand-50 dark:bg-brand-950/40',
    'O-': 'bg-brand-50 dark:bg-brand-950/40',
};

function UrgencyCard({
    request,
    dict,
    isRTL,
    onOpenFulfillDialog,
    onEdit,
    onDelete,
    fulfillPending,
    deletePending,
}: {
    request: BloodRequest;
    dict: any;
    isRTL?: boolean;
    onOpenFulfillDialog: (r: BloodRequest) => void;
    onEdit: (r: BloodRequest) => void;
    onDelete: (r: BloodRequest) => void;
    fulfillPending: boolean;
    deletePending: boolean;
}) {
    const isActive = request.status === 'active';
    const bgTint = BLOOD_BG[request.bloodGroup as string] ?? 'bg-muted/30';
    const gradClass =
        URGENCY_GRADIENTS[request.status] ?? URGENCY_GRADIENTS.active;

    return (
        <Card
            className={cn(
                'card-lift relative overflow-hidden border-0 shadow-md',
                bgTint,
            )}>
            {/* Status top bar */}
            <div
                className={cn(
                    'absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r',
                    gradClass,
                )}
            />

            <CardContent className="pt-5 pb-4 px-4 flex flex-col gap-3">
                {/* Top row — blood group + status badge */}
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <span
                            className={cn(
                                'flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br text-white font-display font-black text-sm shadow-md',
                                gradClass,
                            )}>
                            <span className="latin text-base">
                                {getBloodGroupLabel(
                                    request.bloodGroup,
                                    dict,
                                    'request',
                                )}
                            </span>
                        </span>
                        <div>
                            {isActive && (
                                <span className="flex items-center gap-1 text-[10px] text-brand-600 dark:text-brand-400 font-semibold uppercase tracking-wider">
                                    <span className="relative flex h-1.5 w-1.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand-600" />
                                    </span>
                                    {dict.bloodRequests.status.active}
                                </span>
                            )}
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn(
                            'text-[10px] shrink-0',
                            getStatusColor(request.status),
                        )}>
                        {dict.bloodRequests.status[
                            request.status.toLowerCase()
                        ] ?? request.status}
                    </Badge>
                </div>

                {/* Meta */}
                <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span>
                            {getLocation(request.city.id, isRTL)?.regionName}
                            {' · '}
                            {getLocation(request.city.id, isRTL)?.cityName}
                        </span>
                    </div>
                    {request.phone && (
                        <div className="flex items-center gap-1.5">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            <span className="latin">{request.phone}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                        <span className="latin">
                            {format(new Date(request.createdAt), 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>

                {request.description && (
                    <p className="text-xs text-muted-foreground/80 line-clamp-2 border-t border-border/50 pt-2">
                        {request.description}
                    </p>
                )}

                {/* Actions */}
                <div
                    className={cn(
                        'flex flex-col gap-2 pt-3 border-t border-border/40',
                    )}>
                    {/* Primary: Help now (active + has phone) */}
                    {isActive && request.phone && (
                        <a href={`tel:${request.phone}`} className="block">
                            <Button
                                size="sm"
                                variant="default"
                                className="w-full text-xs font-bold bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white border-0 shadow-sm">
                                <Phone className="h-3.5 w-3.5 mr-1.5" />
                                {dict.profile.helpNow}
                            </Button>
                        </a>
                    )}
                    {/* Secondary: Mark fulfilled (active only), Edit, Delete */}
                    <div
                        className={cn(
                            'flex items-center gap-2 flex-wrap',
                            isRTL ? 'flex-row-reverse' : 'flex-row',
                        )}>
                        {isActive && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                                onClick={() => onOpenFulfillDialog(request)}
                                disabled={fulfillPending}
                                title={dict.bloodRequests.markAsFulfilled}>
                                <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                                <span>
                                    {dict.bloodRequests.markAsFulfilled}
                                </span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs h-8"
                            title={dict.bloodRequests.editRequest}
                            onClick={() => onEdit(request)}>
                            <Pencil className="h-3.5 w-3.5 shrink-0" />
                            <span className="sr-only sm:not-sr-only">
                                {dict.bloodRequests.editRequest}
                            </span>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 text-xs h-8 text-destructive hover:bg-destructive/10"
                            onClick={() => onDelete(request)}
                            disabled={deletePending}
                            title={dict.common.delete}>
                            <Trash2 className="h-3.5 w-3.5 shrink-0" />
                            <span className="sr-only sm:not-sr-only">
                                {dict.common.delete}
                            </span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export function ProfileUrgencyFeed({
    user,
    bloodRequests,
    dict,
    isRTL,
}: ProfileUrgencyFeedProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [fulfillDialogOpen, setFulfillDialogOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(
        null,
    );
    const [requestSheetOpen, setRequestSheetOpen] = useState(false);
    const [requestSheetMode, setRequestSheetMode] = useState<'new' | 'edit'>(
        'new',
    );
    const [requestToEdit, setRequestToEdit] = useState<BloodRequest | null>(
        null,
    );

    const [deleteState, deleteAction, deletePending] = useActionState<
        ActionState,
        FormData
    >(deleteBloodRequest, { error: '', success: '' });
    const [fulfillState, fulfillAction, fulfillPending] = useActionState<
        ActionState,
        FormData
    >(markAsFulfilled, { error: '', success: '' });

    useEffect(() => {
        if (deleteState.success) {
            toast({
                title: dict.common.success,
                description: deleteState.success,
            });
            setDeleteDialogOpen(false);
            router.refresh();
        } else if (deleteState.error) {
            toast({
                title: dict.common.error,
                description: deleteState.error,
                variant: 'destructive',
            });
        }
    }, [deleteState, toast, router, dict]);

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

    const handleMarkFulfilled = (request: BloodRequest) => {
        const fd = new FormData();
        fd.append('id', request.id.toString());
        startTransition(() => fulfillAction(fd));
    };

    const openFulfillDialog = (request: BloodRequest) => {
        setSelectedRequest(request);
        setFulfillDialogOpen(true);
    };

    const confirmFulfill = () => {
        if (selectedRequest) {
            handleMarkFulfilled(selectedRequest);
            setFulfillDialogOpen(false);
        }
    };

    const handleDelete = (request: BloodRequest) => {
        const fd = new FormData();
        fd.append('id', request.id.toString());
        startTransition(() => deleteAction(fd));
    };

    const activeRequests = bloodRequests.filter(r => r.status === 'active');
    const otherRequests = bloodRequests.filter(r => r.status !== 'active');

    return (
        <section className="flex flex-col gap-0 min-w-0">
            <Tabs defaultValue="requests" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* ── Tab bar ── */}
                <TabsList className="w-full h-auto p-1 mb-5 bg-muted/60 rounded-xl grid grid-cols-2">
                    <TabsTrigger
                        value="requests"
                        className={cn(
                            'flex items-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all',
                            'data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-brand-700',
                        )}>
                        <Droplets className="h-4 w-4" />
                        <span>{dict.profile.tabs.bloodRequests}</span>
                        {activeRequests.length > 0 && (
                            <span className="latin ml-1 inline-flex items-center justify-center h-4.5 min-w-[18px] px-1 rounded-full bg-brand-600 text-[10px] font-bold text-white leading-none">
                                {activeRequests.length}
                            </span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="account"
                        className={cn(
                            'flex items-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition-all',
                            'data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-brand-700',
                        )}>
                        <UserCog className="h-4 w-4" />
                        <span>{dict.profile.tabs.accountInfo}</span>
                    </TabsTrigger>
                </TabsList>

                {/* ── Blood Requests tab ── */}
                <TabsContent
                    value="requests"
                    className="mt-0 flex flex-col gap-5">
                    {/* Header */}
                    <div
                        className={cn(
                            'flex items-center justify-between gap-2',
                            isRTL && 'flex-row-reverse',
                        )}>
                        <div>
                            <h2 className="font-display text-lg font-black tracking-tight flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-brand-600" />
                                {dict.bloodRequests.myRequests}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {activeRequests.length > 0
                                    ? `${activeRequests.length} ${dict.bloodRequests.status.active} · ${otherRequests.length} ${dict.bloodRequests.status.fulfilled}`
                                    : dict.profile.noActiveRequests}
                            </p>
                        </div>
                        <Button
                            size="sm"
                            className="gap-1.5 font-bold bg-brand-600 hover:bg-brand-700 text-white border-0"
                            onClick={() => {
                                setRequestSheetMode('new');
                                setRequestToEdit(null);
                                setRequestSheetOpen(true);
                            }}>
                            <Plus className="h-4 w-4" />
                            {dict.bloodRequests.newRequest}
                        </Button>
                    </div>

                    {/* Active requests */}
                    {activeRequests.length > 0 && (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {activeRequests.map(r => (
                                <UrgencyCard
                                    key={r.id}
                                    request={r}
                                    dict={dict}
                                    isRTL={isRTL}
                                    onOpenFulfillDialog={openFulfillDialog}
                                    onEdit={req => {
                                        setRequestToEdit(req);
                                        setRequestSheetMode('edit');
                                        setRequestSheetOpen(true);
                                    }}
                                    onDelete={req => {
                                        setSelectedRequest(req);
                                        setDeleteDialogOpen(true);
                                    }}
                                    fulfillPending={fulfillPending}
                                    deletePending={deletePending}
                                />
                            ))}
                        </div>
                    )}

                    {/* Other (fulfilled/expired) requests */}
                    {otherRequests.length > 0 && (
                        <>
                            {activeRequests.length > 0 && (
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {dict.bloodRequests.status.fulfilled}
                                </p>
                            )}
                            <div className="grid gap-3 sm:grid-cols-2 opacity-70">
                                {otherRequests.map(r => (
                                    <UrgencyCard
                                        key={r.id}
                                        request={r}
                                        dict={dict}
                                        isRTL={isRTL}
                                        onOpenFulfillDialog={openFulfillDialog}
                                        onEdit={req => {
                                            setRequestToEdit(req);
                                            setRequestSheetMode('edit');
                                            setRequestSheetOpen(true);
                                        }}
                                        onDelete={req => {
                                            setSelectedRequest(req);
                                            setDeleteDialogOpen(true);
                                        }}
                                        fulfillPending={fulfillPending}
                                        deletePending={deletePending}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Empty state */}
                    {bloodRequests.length === 0 && (
                        <Card className="border-dashed border-2 bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center gap-3 py-14 text-center">
                                <Droplets className="h-12 w-12 text-muted-foreground/40" />
                                <p className="text-muted-foreground font-medium">
                                    {dict.bloodRequests.noRequests}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1.5"
                                    onClick={() => {
                                        setRequestSheetMode('new');
                                        setRequestToEdit(null);
                                        setRequestSheetOpen(true);
                                    }}>
                                    <Plus className="h-4 w-4" />
                                    {dict.bloodRequests.newRequest}
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* ── Account Info tab ── */}
                <TabsContent value="account" className="mt-0">
                    <Card className="overflow-hidden border-0 shadow-sm">
                        <AccountForm user={user} dict={dict} isRTL={isRTL} />
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Delete confirmation dialog */}
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dict.bloodRequests?.deleteDialog?.title ??
                                'Delete request?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict.bloodRequests?.deleteDialog?.description ??
                                'This action cannot be undone.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {dict.common?.cancel ?? 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() =>
                                selectedRequest && handleDelete(selectedRequest)
                            }
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deletePending}>
                            {deletePending
                                ? (dict.common?.deleting ?? 'Deleting…')
                                : (dict.common?.delete ?? 'Delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Mark as fulfilled confirmation dialog */}
            <AlertDialog
                open={fulfillDialogOpen}
                onOpenChange={setFulfillDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dict.bloodRequests?.fulfillDialog?.title ??
                                'Mark as fulfilled?'}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict.bloodRequests?.fulfillDialog?.description ??
                                'This request will no longer appear as active.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {dict.common?.cancel ?? 'Cancel'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmFulfill}
                            disabled={fulfillPending}
                            className="bg-emerald-600 text-white hover:bg-emerald-700">
                            {fulfillPending
                                ? (dict.common?.saving ?? 'Saving…')
                                : (dict.bloodRequests?.markAsFulfilled ??
                                  'Mark as Fulfilled')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Request form sheet (new / edit) */}
            <Sheet open={requestSheetOpen} onOpenChange={setRequestSheetOpen}>
                <SheetContent
                    side={isRTL ? 'left' : 'right'}
                    className="w-full overflow-y-auto sm:max-w-xl p-0 flex flex-col">
                    <VisuallyHidden>
                        <SheetTitle>{dict.bloodRequests.newRequest}</SheetTitle>
                    </VisuallyHidden>
                    <div className="flex-1 overflow-y-auto p-6 pt-14">
                        <RequestForm
                            key={
                                requestSheetMode === 'edit' && requestToEdit
                                    ? `edit-${requestToEdit.id}`
                                    : 'new'
                            }
                            request={
                                requestSheetMode === 'edit'
                                    ? requestToEdit
                                    : undefined
                            }
                            userId={user.id}
                            mode={requestSheetMode === 'new' ? 'add' : 'edit'}
                            dict={dict}
                            isRTL={isRTL}
                            embedInSheet
                            onSuccess={() => {
                                setRequestSheetOpen(false);
                                router.refresh();
                            }}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </section>
    );
}
