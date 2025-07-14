import { BloodRequestFilters } from '@/components/requests/request-filters';
import { DashboardShell } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { getUser } from '@/auth/session';
import { BloodGroup, Role } from '@/types/enums';
import BloodRequestsClient from '@/components/requests/requests-client';

export default async function RequestsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page: number;
        search: string;
        status: string;
        bloodGroup: BloodGroup;
        region?: string;
        cityId?: string;
    }>;
}) {
    const { page, search, status, bloodGroup, region, cityId } =
        await searchParams;
    const currentPage = page || 1;
    const currentSearch = search ?? '';
    const currentUser = await getUser();

    return (
        <DashboardShell
            header="Requests"
            description="Manage your blood requests."
            toolbar={
                <Link href="/dashboard/requests/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Request
                    </Button>
                </Link>
            }>
            <BloodRequestFilters />
            <BloodRequestsClient
                currentPage={currentPage}
                currentSearch={currentSearch}
                currentStatus={status}
                currentBloodGroup={bloodGroup}
                userRole={currentUser!.role as Role}
                currentRegion={region}
                currentCityId={cityId}
            />
        </DashboardShell>
    );
}
