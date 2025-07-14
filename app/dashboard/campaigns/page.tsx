import { CampaignFilters } from '@/components/campaigns/campaign-filters';
import { DashboardShell } from '@/components/dashboard/shell';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import CampaignsClient from '@/components/campaigns/campaigns-client';
import { getUser } from '@/auth/session';
import { Role } from '@/types/enums';

export default async function CampaignsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page: number;
        search: string;
        status: string;
    }>;
}) {
    const { page, search, status } = await searchParams;
    const currentPage = page || 1;
    const currentSearch = search ?? '';
    const currentUser = await getUser();

    return (
        <DashboardShell
            header="Campaigns"
            description="Manage your blood donation campaigns."
            toolbar={
                <Link href="/dashboard/campaigns/add">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Campaign
                    </Button>
                </Link>
            }
        >
            <CampaignFilters />
            <CampaignsClient
                currentPage={currentPage}
                currentSearch={currentSearch}
                currentStatus={status}
                userRole={currentUser!.role as Role}
            />
        </DashboardShell>
    );
}
