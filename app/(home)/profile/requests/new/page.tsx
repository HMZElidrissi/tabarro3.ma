import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import { Role } from '@/types/enums';
import { RequestForm } from '@/components/profile/request-form';
import { Metadata } from 'next';
import { getDictionary } from '@/i18n/get-dictionary';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.bloodRequests.newRequest,
    };
}

export default async function NewRequestPage() {
    const user = await getUser();
    const dict = await getDictionary();

    if (!user) {
        redirect('/sign-in');
    }

    if (user.role !== Role.PARTICIPANT) {
        redirect('/dashboard');
    }

    return (
        <div className="container py-8 max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {dict.bloodRequests.newRequest}
                    </h1>
                    <p className="text-muted-foreground">
                        {dict.bloodRequests.createRequestDescription}
                    </p>
                </div>
                <RequestForm userId={user.id} mode="add" dict={dict} />
            </div>
        </div>
    );
}
