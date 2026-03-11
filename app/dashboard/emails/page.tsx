import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import EmailPreview from '@/components/emails/email-preview';
import { DashboardShell } from '@/components/dashboard/shell';

export default async function EmailsPage() {
    const user = await getUser();

    if (!user) {
        redirect('/sign-in');
    }

    return (
        <DashboardShell
            header="Emails management"
            description="Test email templates and send customized ones."
        >
            <EmailPreview />
        </DashboardShell>
    );
}
