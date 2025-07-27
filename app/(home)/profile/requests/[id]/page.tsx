import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import { getBloodRequest } from '@/actions/profile';
import { Role } from '@/types/enums';
import { RequestForm } from '@/components/profile/request-form';
import { BloodRequest } from '@/types/blood-request';
import { Metadata } from 'next';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.bloodRequests.editRequest,
    };
}

export default async function EditRequestPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const user = await getUser();
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';

    if (!user) {
        redirect('/sign-in');
    }

    if (user.role !== Role.PARTICIPANT) {
        redirect('/dashboard');
    }

    const request = await getBloodRequest(parseInt(id));

    if (!request || request.userId !== user.id) {
        redirect('/profile');
    }

    return (
        <div className="container py-8 max-w-2xl mx-auto">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {dict.bloodRequests.editRequest}
                    </h1>
                    <p className="text-muted-foreground">
                        {dict.bloodRequests.editRequestDescription}
                    </p>
                </div>
                <RequestForm
                    request={request as BloodRequest}
                    userId={user.id}
                    mode="edit"
                    dict={dict}
                    isRTL={isRTL}
                />
            </div>
        </div>
    );
}
