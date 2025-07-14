'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
import { Loader2 } from 'lucide-react';
import { startTransition, useActionState, useEffect, useState } from 'react';
import { ActionState } from '@/auth/middleware';
import { deleteAccount } from '@/actions/account';
import { useToast } from '@/hooks/use-toast';

export default function DeleteAccountDialog() {
    const { toast } = useToast();
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

    const [deleteState, deleteAction, deletePending] = useActionState<
        ActionState,
        FormData
    >(deleteAccount, { error: '', success: '' });

    useEffect(() => {
        if (deleteState.error) {
            toast({
                title: 'Error',
                description: deleteState.error,
                variant: 'destructive',
            });
        }
    }, [deleteState, toast]);

    const handleDeleteAccount = async (formData: FormData) => {
        startTransition(async () => {
            await deleteAction(formData);
            // No need to handle success as the action redirects on success
        });
    };
    return (
        <Card className="border-red-200">
            <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>
                    Permanently delete your account and all associated data.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog
                    open={confirmDeleteOpen}
                    onOpenChange={setConfirmDeleteOpen}
                >
                    <DialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent aria-describedby="delete-account-form">
                        <form action={handleDeleteAccount}>
                            <DialogHeader>
                                <DialogTitle>Delete Account</DialogTitle>
                                <DialogDescription>
                                    This action cannot be undone. Please enter
                                    your password to confirm deletion.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="my-6">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    className="mt-2"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setConfirmDeleteOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={deletePending}
                                >
                                    {deletePending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        'Delete Account'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}
