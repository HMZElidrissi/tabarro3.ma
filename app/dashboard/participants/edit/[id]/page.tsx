import ParticipantForm from '@/components/participants/participant-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { getParticipant, updateParticipant } from '@/actions/participant';
import { User } from '@/types/user';
import { notFound } from 'next/navigation';

export default async function EditParticipant({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const participant = await getParticipant(id);

    if (participant === null) {
        notFound();
    }

    return (
        <DashboardShell
            header="Edit Participant"
            description="Update the participant's details."
        >
            <ParticipantForm
                mode="edit"
                participant={participant as User}
                action={updateParticipant}
            />
        </DashboardShell>
    );
}
