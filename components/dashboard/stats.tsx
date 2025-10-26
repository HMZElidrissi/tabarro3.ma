'use client';

import {
    Users,
    Building2,
    Trophy,
    Droplets,
    TentTree,
    CalendarCheck,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Role } from '@/types/enums';
import { cn } from '@/lib/utils';

interface StatItem {
    title: string;
    value: string | undefined;
    icon: any;
    description: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

interface DashboardStatsProps {
    userRole: Role;
    stats: {
        totalParticipants?: number;
        totalOrganizations?: number;
        totalCampaigns: number;
        totalBloodRequests: number;
        activeCampaigns: number;
        upcomingCampaigns: number;
        previousChange?: number;
    };
}

export function DashboardStats({ userRole, stats }: DashboardStatsProps) {
    const adminStats: StatItem[] = [
        {
            title: 'Total Participants',
            value: stats.totalParticipants?.toLocaleString(),
            icon: Users,
            description: 'Platform participants',
            trend: stats.previousChange
                ? {
                      value: stats.previousChange,
                      isPositive: stats.previousChange > 0,
                  }
                : undefined,
            className:
                'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900',
        },
        {
            title: 'Organizations',
            value: stats.totalOrganizations?.toLocaleString(),
            icon: Building2,
            description: 'Registered organizations',
            className:
                'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-100 dark:border-purple-900',
        },
        {
            title: 'Total Campaigns',
            value: stats.totalCampaigns?.toLocaleString(),
            icon: Trophy,
            description: 'Blood donation campaigns',
            className:
                'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-100 dark:border-amber-900',
        },
        {
            title: 'Blood Requests',
            value: stats.totalBloodRequests?.toLocaleString(),
            icon: Droplets,
            description: 'Active blood requests',
            className:
                'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border-red-100 dark:border-red-900',
        },
    ];

    const organizationStats: StatItem[] = [
        {
            title: 'Active Campaigns',
            value: stats.activeCampaigns?.toLocaleString(),
            icon: TentTree,
            description: 'Currently running',
            className:
                'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-100 dark:border-emerald-900',
        },
        {
            title: 'Upcoming Campaigns',
            value: stats.upcomingCampaigns?.toLocaleString(),
            icon: CalendarCheck,
            description: 'Scheduled campaigns',
            className:
                'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900',
        },
        {
            title: 'Total Campaigns',
            value: stats.totalCampaigns?.toLocaleString(),
            icon: Trophy,
            description: 'All time campaigns',
            className:
                'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-100 dark:border-amber-900',
        },
        {
            title: 'Campaign Participants',
            value: stats.totalParticipants?.toLocaleString(),
            icon: Users,
            description: 'Total in your campaigns',
            className:
                'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-100 dark:border-purple-900',
        },
    ];

    const currentStats =
        userRole === Role.ADMIN ? adminStats : organizationStats;

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {currentStats.map((stat, index) => (
                <Card
                    key={index}
                    className={cn(
                        'border transition-all hover:shadow-md',
                        stat.className,
                    )}
                >
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between space-x-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </span>
                                <span className="text-2xl font-bold tracking-tight">
                                    {stat.value || '0'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {stat.description}
                                </span>
                                {stat.trend && (
                                    <div
                                        className={cn(
                                            'text-xs font-medium mt-1',
                                            stat.trend.isPositive
                                                ? 'text-green-600'
                                                : 'text-red-600',
                                        )}
                                    >
                                        {stat.trend.isPositive ? '↑' : '↓'}{' '}
                                        {Math.abs(stat.trend.value)}% from last
                                        month
                                    </div>
                                )}
                            </div>
                            <div
                                className={cn(
                                    'rounded-full p-2 ring-2 ring-opacity-25',
                                    stat.className?.includes('blue')
                                        ? 'ring-blue-500'
                                        : stat.className?.includes('purple')
                                          ? 'ring-purple-500'
                                          : stat.className?.includes('amber')
                                            ? 'ring-amber-500'
                                            : stat.className?.includes('red')
                                              ? 'ring-red-500'
                                              : stat.className?.includes(
                                                      'emerald',
                                                  )
                                                ? 'ring-emerald-500'
                                                : 'ring-gray-500',
                                )}
                            >
                                <stat.icon
                                    className={cn(
                                        'h-5 w-5',
                                        stat.className?.includes('blue')
                                            ? 'text-blue-500'
                                            : stat.className?.includes('purple')
                                              ? 'text-purple-500'
                                              : stat.className?.includes(
                                                      'amber',
                                                  )
                                                ? 'text-amber-500'
                                                : stat.className?.includes(
                                                        'red',
                                                    )
                                                  ? 'text-red-500'
                                                  : stat.className?.includes(
                                                          'emerald',
                                                      )
                                                    ? 'text-emerald-500'
                                                    : 'text-gray-500',
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
