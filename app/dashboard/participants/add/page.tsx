import ParticipantForm from '@/components/participants/participant-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { createParticipant } from '@/actions/participant';

export default function AddParticipant() {
    return (
        <DashboardShell
            header="Add Participant"
            description="Create a new participant account."
        >
            <ParticipantForm mode="add" action={createParticipant} />
        </DashboardShell>
    );
}
