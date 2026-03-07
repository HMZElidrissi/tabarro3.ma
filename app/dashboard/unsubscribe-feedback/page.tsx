import { DashboardShell } from '@/components/dashboard/shell';
import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import { Role } from '@/types/enums';
import UnsubscribeFeedbackClient from '@/components/unsubscribe-feedback/unsubscribe-feedback-client';

export default async function UnsubscribeFeedbackPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; type?: string }>;
}) {
    const user = await getUser();
    if (user?.role !== Role.ADMIN) {
        redirect('/dashboard');
    }

    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const currentType = params.type || 'all';

    return (
        <DashboardShell
            header="Unsubscribe feedback"
            description="Feedback collected when users unsubscribe from campaign digests or blood request emails."
        >
            <UnsubscribeFeedbackClient
                currentPage={currentPage}
                currentType={currentType}
            />
        </DashboardShell>
    );
}
