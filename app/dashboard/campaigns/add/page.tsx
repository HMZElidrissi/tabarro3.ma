import CampaignForm from '@/components/campaigns/campaign-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { createCampaign } from '@/actions/campaign';
import { getUser } from '@/auth/session';
import { Role } from '@/types/enums';
import { getOrganizations } from '@/actions/organization';
import { User } from '@/types/user';

export default async function AddCampaign() {
    const currentUser = await getUser();
    let organizations;
    if (currentUser?.role === Role.ADMIN) {
        ({ organizations } = await getOrganizations({}, new FormData()));
    }

    return (
        <DashboardShell
            header="Add Campaign"
            description="Create a new campaign."
        >
            <CampaignForm
                mode="add"
                action={createCampaign}
                userRole={currentUser!.role as Role}
                organizationId={
                    currentUser!.role === Role.ORGANIZATION
                        ? currentUser!.id
                        : undefined
                }
                organizations={organizations as unknown as User[]}
            />
        </DashboardShell>
    );
}
