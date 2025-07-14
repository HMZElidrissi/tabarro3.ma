import { DashboardSkeleton } from '@/components/loading/dashboard-skeleton';
import { DashboardShell } from '@/components/dashboard/shell';

export default function DashboardLoading() {
    return (
        <DashboardShell
            header="Dashboard"
            description="Loading your dashboard..."
        >
            <DashboardSkeleton />
        </DashboardShell>
    );
}
