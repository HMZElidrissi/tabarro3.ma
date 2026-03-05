import { ResetPasswordForm } from '@/components/auth/reset-password';
import { prisma } from '@/lib/prisma';
import { AuthCardSkeleton } from '@/components/loading/auth-card-skeleton';
import { Suspense } from 'react';
import { getDictionary } from '@/i18n/get-dictionary';
import { Metadata } from 'next';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: dict.auth.resetPassword.title,
    };
}

export default async function ResetPasswordPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const dict = await getDictionary();
    const { token } = await params;
    const resetRequest = await prisma.passwordReset.findFirst({
        where: {
            token,
            used: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    if (!resetRequest) {
        return (
            <div className="mx-auto max-w-sm space-y-4 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                    {dict.auth.forgotPassword.invalidLinkTitle}
                </h1>
                <p className="text-muted-foreground">
                    {dict.auth.forgotPassword.invalidOrExpiredLink}
                </p>
                <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                    {dict.auth.forgotPassword.title}
                </Link>
            </div>
        );
    }

    return (
        <Suspense fallback={<AuthCardSkeleton />}>
            <ResetPasswordForm token={token} dict={dict} />
        </Suspense>
    );
}
