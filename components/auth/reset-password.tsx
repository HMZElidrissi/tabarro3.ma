'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { resetPassword } from '@/actions/password';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ActionState } from '@/auth/middleware';

interface ResetPasswordFormProps {
    token: string;
    dict: any;
}

export function ResetPasswordForm({ token, dict }: ResetPasswordFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        resetPassword,
        { error: '', success: '' },
    );

    useEffect(() => {
        if (state.error) {
            toast({
                title: dict.common.error,
                description: state.error,
                variant: 'destructive',
            });
        } else if (state.success) {
            toast({
                title: dict.common.success,
                description: state.success,
            });
            router.push('/sign-in');
        }
    }, [state, router, toast, dict]);

    return (
        <form action={formAction} className="space-y-4">
            <input type="hidden" name="token" value={token} />

            <div>
                <Label htmlFor="password">
                    {dict.auth.resetPassword.newPassword}
                </Label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    className="mt-1"
                    placeholder={dict.auth.resetPassword.enterNewPassword}
                    autoComplete="new-password"
                />
            </div>

            <div>
                <Label htmlFor="confirmPassword">
                    {dict.auth.resetPassword.confirmPassword}
                </Label>
                <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    minLength={8}
                    maxLength={100}
                    className="mt-1"
                    placeholder={
                        dict.auth.resetPassword.confirmPasswordPlaceholder
                    }
                    autoComplete="new-password"
                />
            </div>

            <Button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                disabled={pending}>
                {pending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {dict.auth.resetPassword.resettingPassword}
                    </>
                ) : (
                    dict.auth.resetPassword.resetPassword
                )}
            </Button>
        </form>
    );
}
