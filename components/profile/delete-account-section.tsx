'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { startTransition, useActionState, useState } from 'react';
import { ActionState } from '@/auth/middleware';
import { deleteAccount } from '@/actions/account';

interface DeleteAccountSectionProps {
    dict: any;
}

export function DeleteAccountSection({ dict }: DeleteAccountSectionProps) {
    const t = dict.profile.deleteAccount;
    // The word the user must type to unlock deletion — comes from dict.common.delete
    const confirmWord: string = dict.common.delete.toLowerCase();

    const [open, setOpen] = useState(false);
    const [typed, setTyped] = useState('');

    const [, deleteAction, deletePending] = useActionState<ActionState, FormData>(
        deleteAccount,
        { error: '', success: '' },
    );

    const isConfirmed = typed.trim().toLowerCase() === confirmWord;

    const handleOpenChange = (next: boolean) => {
        if (!next) setTyped(''); // reset input when dialog closes
        setOpen(next);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isConfirmed) return;
        const formData = new FormData(e.currentTarget);
        startTransition(async () => {
            await deleteAction(formData);
        });
    };

    return (
        <div className="rounded-xl border border-red-500/20 bg-red-950/20 backdrop-blur-sm p-4">
            {/* Danger zone header */}
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-[11px] text-red-400 uppercase tracking-wider font-semibold">
                    {t.dangerZone}
                </span>
            </div>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full gap-2 bg-red-600/80 hover:bg-red-600 border-0 text-white text-xs font-semibold transition-all duration-200"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t.trigger}
                    </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <DialogTitle className="text-red-600">
                                    {t.title}
                                </DialogTitle>
                            </div>
                            <DialogDescription className="text-sm leading-relaxed pt-1">
                                {t.description}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="my-5 space-y-2">
                            <Label
                                htmlFor="delete-account-confirm"
                                className="text-sm font-medium"
                            >
                                {t.confirmLabel}
                            </Label>
                            {/* Hint showing exactly what to type */}
                            <p className="text-xs text-muted-foreground">
                                {t.confirmHint}
                            </p>
                            <Input
                                id="delete-account-confirm"
                                name="confirm"
                                type="text"
                                autoComplete="off"
                                spellCheck={false}
                                value={typed}
                                onChange={(e) => setTyped(e.target.value)}
                                placeholder={t.confirmPlaceholder}
                                className={
                                    typed.length > 0
                                        ? isConfirmed
                                            ? 'border-red-400 focus-visible:ring-red-400'
                                            : 'border-orange-300 focus-visible:ring-orange-300'
                                        : 'focus-visible:ring-red-300'
                                }
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                disabled={deletePending}
                            >
                                {t.cancel}
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                disabled={!isConfirmed || deletePending}
                                className="gap-2"
                            >
                                {deletePending ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {t.deleting}
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        {t.confirm}
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
