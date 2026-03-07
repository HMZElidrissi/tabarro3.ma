'use client';

import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { submitUnsubscribe } from '@/actions/unsubscribe';
import { ActionState } from '@/auth/middleware';

interface UnsubscribeFormProps {
    token: string;
    dict: {
        unsubscribe?: {
            title: string;
            description: string;
            reasonLabel: string;
            reasonPlaceholder: string;
            submitButton: string;
            submitButtonLoading: string;
        };
    };
}

export function UnsubscribeForm({ token, dict }: UnsubscribeFormProps) {
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        submitUnsubscribe,
        {
            error: '',
            success: '',
        },
    );

    const u = dict.unsubscribe;
    const disabled = pending || !!state.success;
    const title = u?.title ?? 'Se désabonner des notifications';
    const description =
        u?.description ??
        'Vous pouvez nous indiquer pourquoi vous ne souhaitez plus recevoir ces emails (optionnel).';
    const reasonLabel = u?.reasonLabel ?? 'Pourquoi vous désabonnez-vous ?';
    const reasonPlaceholder =
        u?.reasonPlaceholder ??
        "Exemples : je reçois trop d'emails, je n'habite plus dans cette région, autre...";
    const submitButton = u?.submitButton ?? 'Confirmer le désabonnement';
    const submitButtonLoading =
        u?.submitButtonLoading ?? 'Traitement en cours...';

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
            <Card className="w-full max-w-lg">
                <form action={formAction}>
                    <input type="hidden" name="token" value={token} />
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {state.error && (
                            <p className="text-sm text-red-600">
                                {state.error}
                            </p>
                        )}
                        {state.success && (
                            <p className="text-sm text-green-600">
                                {state.success}
                            </p>
                        )}

                        {!state.success && (
                            <>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                                <div className="space-y-2">
                                    <Label htmlFor="reason">
                                        {reasonLabel}
                                    </Label>
                                    <Textarea
                                        id="reason"
                                        name="reason"
                                        placeholder={reasonPlaceholder}
                                        rows={4}
                                        disabled={disabled}
                                    />
                                </div>
                            </>
                        )}

                        {!state.success && (
                            <Button
                                type="submit"
                                variant="brand"
                                disabled={disabled}
                                className="mt-2"
                            >
                                {pending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {submitButtonLoading}
                                    </>
                                ) : (
                                    submitButton
                                )}
                            </Button>
                        )}
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
