'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useRef } from 'react';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
);

interface AnalyticsData {
    bloodGroups: {
        labels: string[];
        counts: number[];
    };
    cities: {
        labels: string[];
        counts: number[];
    };
    participationTrend: {
        labels: string[];
        counts: number[];
    };
}

interface ParticipantAnalyticsProps {
    data: AnalyticsData;
}

export function ParticipantAnalytics({ data }: ParticipantAnalyticsProps) {
    if (!data || !data.bloodGroups || data.bloodGroups.labels.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Participant Analytics</CardTitle>
                    <CardDescription>
                        Analyze characteristics of your campaign participants
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No data available yet. Start collecting participant
                        data.
                    </p>
                </CardContent>
            </Card>
        );
    }

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
        },
    };

    const bloodGroupData = {
        labels: data.bloodGroups.labels,
        datasets: [
            {
                label: 'Blood Groups',
                data: data.bloodGroups.counts,
                backgroundColor: [
                    'rgba(239, 68, 68, 0.8)', // Red - A+
                    'rgba(239, 68, 68, 0.6)', // Red - A-
                    'rgba(59, 130, 246, 0.8)', // Blue - B+
                    'rgba(59, 130, 246, 0.6)', // Blue - B-
                    'rgba(34, 197, 94, 0.8)', // Green - O+
                    'rgba(34, 197, 94, 0.6)', // Green - O-
                    'rgba(168, 85, 247, 0.8)', // Purple - AB+
                    'rgba(168, 85, 247, 0.6)', // Purple - AB-
                ],
                borderColor: [
                    'rgba(239, 68, 68, 1)',
                    'rgba(239, 68, 68, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(34, 197, 94, 1)',
                    'rgba(168, 85, 247, 1)',
                    'rgba(168, 85, 247, 1)',
                ],
                borderWidth: 2,
            },
        ],
    };

    const cityData = {
        labels: data.cities.labels,
        datasets: [
            {
                label: 'Participants',
                data: data.cities.counts,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgba(99, 102, 241, 1)',
                borderWidth: 1,
            },
        ],
    };

    const trendData = {
        labels: data.participationTrend.labels,
        datasets: [
            {
                label: 'Participants',
                data: data.participationTrend.counts,
                backgroundColor: 'rgba(139, 92, 246, 0.8)',
                borderColor: 'rgba(139, 92, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Participant Analytics</CardTitle>
                <CardDescription>
                    Analyze characteristics of your campaign participants
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="blood-groups" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="blood-groups">
                            Blood Groups
                        </TabsTrigger>
                        <TabsTrigger value="cities">Cities</TabsTrigger>
                        <TabsTrigger value="trend">Trend</TabsTrigger>
                    </TabsList>
                    <TabsContent value="blood-groups" className="mt-4">
                        <div className="h-[300px]">
                            <Doughnut
                                data={bloodGroupData}
                                options={chartOptions}
                            />
                        </div>
                    </TabsContent>
                    <TabsContent value="cities" className="mt-4">
                        <div className="h-[300px]">
                            <Bar data={cityData} options={chartOptions} />
                        </div>
                    </TabsContent>
                    <TabsContent value="trend" className="mt-4">
                        <div className="h-[300px]">
                            <Bar data={trendData} options={chartOptions} />
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
