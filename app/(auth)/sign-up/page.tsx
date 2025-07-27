import { Login } from '@/components/auth/login';
import { Suspense } from 'react';
import { AuthCardSkeleton } from '@/components/loading/auth-card-skeleton';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.auth.signUp.title,
    };
}

export default async function SignUpPage() {
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';

    return (
        <Suspense fallback={<AuthCardSkeleton />}>
            <Login mode="signup" dict={dict} isRTL={isRTL} />
        </Suspense>
    );
}
