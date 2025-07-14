import RequestForm from '@/components/requests/request-form';
import { DashboardShell } from '@/components/dashboard/shell';
import { getBloodRequest, updateBloodRequest } from '@/actions/request';
import { notFound } from 'next/navigation';
import { BloodRequest } from '@/types/blood-request';

export default async function EditRequest({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = await params;
    const request = await getBloodRequest(Number(id));

    if (request === null) {
        notFound();
    }

    return (
        <DashboardShell
            header="Edit Request"
            description="Update the request's details."
        >
            <RequestForm
                mode="edit"
                request={request as unknown as BloodRequest}
                action={updateBloodRequest}
            />
        </DashboardShell>
    );
}
