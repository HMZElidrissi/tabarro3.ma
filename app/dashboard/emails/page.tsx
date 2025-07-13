import { Metadata } from 'next';
import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import EmailPreview from '@/components/emails/email-preview';

export const metadata: Metadata = {
    title: 'Email Preview - Dashboard',
    description: 'Preview and send email templates',
};

export default async function EmailsPage() {
    const user = await getUser();

    if (!user) {
        redirect('/sign-in');
    }

    return <EmailPreview />;
}
