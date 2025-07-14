import RequestForm from '@/components/requests/request-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { createBloodRequest } from '@/actions/request';

export default async function AddRequest() {
    return (
        <DashboardShell
            header="Add Request"
            description="Create a new blood request."
        >
            <RequestForm mode="add" action={createBloodRequest} />
        </DashboardShell>
    );
}
