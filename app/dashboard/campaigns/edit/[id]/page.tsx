import CampaignForm from '@/components/campaigns/campaign-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { getCampaign, updateCampaign } from '@/actions/campaign';
import { notFound } from 'next/navigation';
import { Campaign } from '@/types/campaign';
import { getUser } from '@/auth/session';
import { Role } from '@/types/enums';
import { getAllOrganizations } from '@/actions/organization';
import { User } from '@/types/user';

export default async function EditCampaign({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;
    const campaign = await getCampaign(Number(id));

    if (campaign === null) {
        notFound();
    }

    const currentUser = await getUser();

    let organizations;
    if (currentUser?.role === Role.ADMIN) {
        ({ organizations } = await getAllOrganizations({}, new FormData()));
    }

    return (
        <DashboardShell
            header="Edit Campaign"
            description="Update the campaign's details."
        >
            <CampaignForm
                mode="edit"
                campaign={campaign as unknown as Campaign}
                action={updateCampaign}
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
