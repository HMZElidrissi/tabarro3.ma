'use client';

import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

interface RegionChartProps {
    data: {
        labels: string[];
        data: number[];
    };
}

// Define a color palette for regions
const COLORS = [
    'rgba(99, 102, 241, 0.8)', // Indigo
    'rgba(234, 179, 8, 0.8)', // Yellow
    'rgba(239, 68, 68, 0.8)', // Red
    'rgba(34, 197, 94, 0.8)', // Green
    'rgba(168, 85, 247, 0.8)', // Purple
    'rgba(59, 130, 246, 0.8)', // Blue
    'rgba(245, 101, 101, 0.8)', // Pink
    'rgba(16, 185, 129, 0.8)', // Emerald
    'rgba(249, 115, 22, 0.8)', // Orange
    'rgba(139, 92, 246, 0.8)', // Violet
];

export function RegionChart({ data }: RegionChartProps) {
    const chartData: ChartData<'pie'> = {
        labels: data.labels,
        datasets: [
            {
                data: data.data,
                backgroundColor: COLORS.slice(0, data.labels.length),
                borderColor: COLORS.slice(0, data.labels.length).map(color =>
                    color.replace('0.8', '1'),
                ),
                borderWidth: 2,
            },
        ],
    };

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                    },
                    color: '#64748b',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0,
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="h-[350px] w-full">
            <Pie options={options} data={chartData} />
        </div>
    );
}
