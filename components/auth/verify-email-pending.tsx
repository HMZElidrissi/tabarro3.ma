'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { resendVerification } from '@/actions/resend-verification';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ActionState } from '@/auth/middleware';

interface VerifyEmailPendingProps {
    dict: any;
}

export function VerifyEmailPending({ dict }: VerifyEmailPendingProps) {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') ?? '';
    const t = dict.auth.verifyEmail;

    const [state, formAction, isPending] = useActionState<
        ActionState,
        FormData
    >(resendVerification, { error: '', success: '' });
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (state?.success) {
            setCooldown(60);
        }
    }, [state]);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [cooldown]);

    return (
        <div className="mx-auto max-w-sm space-y-6 text-center">
            {/* Icon */}
            <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
            </div>

            {/* Title & description */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-foreground">
                    {t.pendingTitle}
                </h1>
                <p className="text-sm text-muted-foreground">
                    {t.pendingDescription}
                </p>
                {email && (
                    <p className="rounded-md bg-muted px-4 py-2 text-sm font-medium text-foreground">
                        {email}
                    </p>
                )}
            </div>

            {/* Feedback messages */}
            {state?.success && (
                <div className="flex items-center gap-2 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-950/30 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{state.success}</span>
                </div>
            )}
            {state?.error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.error}</span>
                </div>
            )}

            {/* Resend form */}
            <form action={formAction} className="space-y-3">
                <input type="hidden" name="email" value={email} />
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || cooldown > 0}
                    variant="outline"
                >
                    {isPending ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            {t.resending}
                        </>
                    ) : cooldown > 0 ? (
                        t.resendCooldown.replace('{seconds}', String(cooldown))
                    ) : (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            {t.resendLink}
                        </>
                    )}
                </Button>
            </form>

            {/* Back to sign-in */}
            <p className="text-sm text-muted-foreground">
                <Link
                    href="/sign-in"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                >
                    {t.goToSignIn}
                </Link>
            </p>
        </div>
    );
}
