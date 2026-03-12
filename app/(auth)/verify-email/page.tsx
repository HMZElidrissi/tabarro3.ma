import { Suspense } from 'react';
import { AuthCardSkeleton } from '@/components/loading/auth-card-skeleton';
import { getDictionary } from '@/i18n/get-dictionary';
import { VerifyEmailPending } from '@/components/auth/verify-email-pending';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.auth.verifyEmail.pendingTitle,
    };
}

export default async function VerifyEmailPendingPage() {
    const dict = await getDictionary();

    return (
        <Suspense fallback={<AuthCardSkeleton />}>
            <VerifyEmailPending dict={dict} />
        </Suspense>
    );
}
