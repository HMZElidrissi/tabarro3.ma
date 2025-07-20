'use client';

import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData,
    ChartOptions,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
);

interface OverviewProps {
    data: {
        labels: string[];
        data: number[];
    };
}

export function Overview({ data }: OverviewProps) {
    const chartData: ChartData<'bar'> = {
        labels: data.labels,
        datasets: [
            {
                label: 'Participants',
                data: data.data,
                backgroundColor: 'rgba(99, 102, 241, 0.8)',
                borderColor: 'rgb(99, 102, 241)',
                borderWidth: 1,
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                border: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                    },
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                border: {
                    display: false,
                },
                grid: {
                    color: '#e2e8f0',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        size: 12,
                    },
                    stepSize: 1,
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="h-[350px] w-full">
            <Bar options={options} data={chartData} />
        </div>
    );
}
