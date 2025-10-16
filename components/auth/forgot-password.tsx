'use client';

import { useActionState } from 'react';
import { forgotPassword } from '@/actions/password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ActionState } from '@/auth/middleware';

interface ForgotPasswordFormProps {
    dict: any;
}

export function ForgotPasswordForm({ dict }: ForgotPasswordFormProps) {
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        forgotPassword,
        { error: '', success: '' },
    );

    return (
        <div className="mx-auto max-w-sm space-y-6">
            <div className="space-y-2 text-center">
                <h1 className="text-2xl font-bold text-foreground">
                    {dict.auth.forgotPassword.title}
                </h1>
                <p className="text-muted-foreground">
                    {dict.auth.forgotPassword.description}
                </p>
            </div>

            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        name="email"
                        type="email"
                        placeholder={dict.forms.labels.email}
                        required
                        className="w-full"
                    />
                </div>

                {state?.error && (
                    <Alert variant="destructive">
                        <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                {state?.success && (
                    <Alert>
                        <AlertDescription>{state.success}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                    disabled={pending}
                >
                    {pending
                        ? dict.auth.forgotPassword.sending
                        : dict.auth.forgotPassword.sendInstructions}
                </Button>
            </form>
        </div>
    );
}
