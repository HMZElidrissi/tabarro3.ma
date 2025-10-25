import { ParticipantFilters } from '@/components/dashboard/participant-filters';
import { DashboardShell } from '@/components/dashboard/shell';
import ParticipantsClient from '@/components/dashboard/participants-client';
import { getUser } from '@/auth/session';
import { Role } from '@/types/enums';

export default async function CampaignParticipantsPage({
    searchParams,
}: {
    searchParams: Promise<{
        page: number;
        search: string;
        bloodGroup: string;
        region?: string;
        cityId?: string;
    }>;
}) {
    const { page, search, bloodGroup, region, cityId } = await searchParams;
    const currentPage = page || 1;
    const currentSearch = search ?? '';
    const currentBloodGroup = bloodGroup || 'all';
    const currentUser = await getUser();

    return (
        <DashboardShell
            header="Campaign Participants"
            description="View and analyze campaign participants.">
            <ParticipantFilters />
            <ParticipantsClient
                currentPage={currentPage}
                currentSearch={currentSearch}
                currentBloodGroup={currentBloodGroup}
                userRole={currentUser!.role as Role}
                userId={currentUser!.id}
                currentRegion={region}
                currentCityId={cityId}
            />
        </DashboardShell>
    );
}
