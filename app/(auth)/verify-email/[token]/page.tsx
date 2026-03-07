import { AuthCardSkeleton } from '@/components/loading/auth-card-skeleton';
import { prisma } from '@/lib/prisma';
import { getDictionary } from '@/i18n/get-dictionary';
import Link from 'next/link';
import { Suspense } from 'react';

async function VerifyEmailContent({ token }: { token: string }) {
    const dict = await getDictionary();

    const verification = await prisma.emailVerification.findFirst({
        where: {
            token,
            used: false,
            expiresAt: {
                gt: new Date(),
            },
        },
        include: {
            user: true,
        },
    });

    if (!verification) {
        return (
            <div className="mx-auto max-w-sm space-y-4 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                    {dict.auth.verifyEmail.invalidTitle}
                </h1>
                <p className="text-muted-foreground">
                    {dict.auth.verifyEmail.invalidMessage}
                </p>
                <Link
                    href="/sign-in"
                    className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                    {dict.auth.verifyEmail.goToSignIn}
                </Link>
            </div>
        );
    }

    await prisma.$transaction(async tx => {
        await tx.emailVerification.update({
            where: { id: verification.id },
            data: { used: true },
        });

        await tx.user.update({
            where: { id: verification.userId },
            data: { emailVerifiedAt: new Date() },
        });
    });

    return (
        <div className="mx-auto max-w-sm space-y-4 text-center">
            <h1 className="text-2xl font-bold text-foreground">
                {dict.auth.verifyEmail.successTitle}
            </h1>
            <p className="text-muted-foreground">
                {dict.auth.verifyEmail.successMessage}
            </p>
            <Link
                href="/sign-in"
                className="text-sm text-muted-foreground hover:text-foreground underline"
            >
                {dict.auth.verifyEmail.goToSignIn}
            </Link>
        </div>
    );
}

export default async function VerifyEmailPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;

    return (
        <Suspense fallback={<AuthCardSkeleton />}>
            {/* @ts-expect-error Async Server Component */}
            <VerifyEmailContent token={token} />
        </Suspense>
    );
}
