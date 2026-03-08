'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { AccountForm } from '@/components/profile/account-form';
import { BloodRequestsGrid } from '@/components/profile/blood-requests-grid';
import { Separator } from '@/components/ui/separator';
import { User } from '@/types/user';
import { BloodRequest } from '@/types/blood-request';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { CalendarClock, Droplets, Mail, MapPin, User2 } from 'lucide-react';

interface ProfileLayoutProps {
    user: User;
    bloodRequests: BloodRequest[];
    dict: any;
    isRTL?: boolean;
}

export function ProfileLayout({
    user,
    bloodRequests,
    dict,
    isRTL,
}: ProfileLayoutProps) {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState(
        searchParams.get('tab') || 'account',
    );
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const totalRequests = bloodRequests.length;
    const activeRequests = bloodRequests.filter(
        request => request.status === 'active',
    ).length;
    const fulfilledRequests = bloodRequests.filter(
        request => request.status === 'fulfilled',
    ).length;

    // Handle initial animation after mount
    useEffect(() => {
        setShouldAnimate(true);
    }, []);

    return (
        <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className={cn(
                'container py-10 space-y-8 transition-all duration-300',
                shouldAnimate
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4',
            )}
        >
            <div className="grid gap-6 md:grid-cols-[minmax(0,2.1fr)_minmax(0,2fr)] items-stretch">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-brand-600/90 via-brand-700 to-brand-900 text-white shadow-lg">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_#ffffff33,_transparent_55%),radial-gradient(circle_at_bottom,_#00000066,_transparent_55%)]" />
                    <div className="relative flex h-full flex-col gap-6 p-6 sm:p-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-white/30 backdrop-blur">
                                <span className="text-2xl font-semibold">
                                    {user.name?.charAt(0).toUpperCase() ??
                                        user.email.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div
                                className={cn(
                                    'space-y-1',
                                    isRTL ? 'text-right' : 'text-left',
                                )}
                            >
                                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                    {user.name || user.email}
                                </h2>
                                <p className="text-sm text-white/80">
                                    {dict.profile.description}
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-2 rounded-xl bg-black/15 px-3 py-2 text-sm">
                                <Mail className="h-4 w-4 text-brand-50" />
                                <span className="truncate">{user.email}</span>
                            </div>
                            {user.city && (
                                <div className="flex items-center gap-2 rounded-xl bg-black/15 px-3 py-2 text-sm">
                                    <MapPin className="h-4 w-4 text-brand-50" />
                                    <span className="truncate">
                                        {user.city.name}
                                    </span>
                                </div>
                            )}
                            {user.bloodGroup && (
                                <div className="flex items-center gap-2 rounded-xl bg-black/15 px-3 py-2 text-sm">
                                    <Droplets className="h-4 w-4 text-brand-50" />
                                    <span className="font-medium">
                                        {user.bloodGroup}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 rounded-xl bg-black/15 px-3 py-2 text-sm">
                                <CalendarClock className="h-4 w-4 text-brand-50" />
                                <span className="truncate">
                                    {dict.profile?.memberSince ??
                                        'Member of tabarro3'}
                                </span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="border-dashed bg-card/60 backdrop-blur-sm">
                    <div className="flex h-full flex-col gap-4 p-5 sm:p-6">
                        <p
                            className={cn(
                                'text-sm font-medium text-muted-foreground',
                                isRTL ? 'text-right' : 'text-left',
                            )}
                        >
                            {dict.profile?.quickStats ??
                                'Your blood requests at a glance'}
                        </p>
                        <div className="grid flex-1 gap-3 sm:grid-cols-3">
                            <div className="rounded-xl border bg-background/60 p-3 shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    {dict.bloodRequests?.myRequests ??
                                        'Total requests'}
                                </p>
                                <p className="mt-1 text-2xl font-semibold">
                                    {totalRequests}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-background/60 p-3 shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    {dict.bloodRequests?.status?.active ??
                                        'Active'}
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                                    {activeRequests}
                                </p>
                            </div>
                            <div className="rounded-xl border bg-background/60 p-3 shadow-sm">
                                <p className="text-xs text-muted-foreground">
                                    {dict.bloodRequests?.status?.fulfilled ??
                                        'Fulfilled'}
                                </p>
                                <p className="mt-1 text-2xl font-semibold text-sky-600 dark:text-sky-400">
                                    {fulfilledRequests}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <Separator className="mt-2" />

            <Tabs
                value={activeTab}
                className="w-full"
                onValueChange={setActiveTab}
            >
                <TabsList
                    className={cn(
                        'w-full flex rounded-full bg-muted/60 p-1',
                        isRTL ? 'justify-end' : 'justify-start',
                    )}
                >
                    <TabsTrigger
                        value="account"
                        className={cn(
                            'flex gap-2 items-center rounded-full px-4 py-2 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm',
                            isRTL && 'flex-row-reverse',
                        )}
                    >
                        <User2 className="h-6 w-6" />
                        {dict.profile.tabs.accountInfo}
                    </TabsTrigger>
                    <TabsTrigger
                        value="requests"
                        className={cn(
                            'flex gap-2 items-center',
                            isRTL && 'flex-row-reverse',
                        )}
                    >
                        <Droplets className="h-6 w-6" />
                        {dict.profile.tabs.bloodRequests}
                    </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                    <TabsContent
                        value="account"
                        className={cn(
                            'transition-all duration-300',
                            activeTab === 'account'
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4',
                        )}
                    >
                        <Card>
                            <AccountForm
                                user={user}
                                dict={dict}
                                isRTL={isRTL}
                            />
                        </Card>
                    </TabsContent>
                    <TabsContent
                        value="requests"
                        className={cn(
                            'transition-all duration-300',
                            activeTab === 'requests'
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-0 translate-y-4',
                        )}
                    >
                        <Card className="p-6">
                            <BloodRequestsGrid
                                initialRequests={bloodRequests}
                                dict={dict}
                                isRTL={isRTL}
                            />
                        </Card>
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
