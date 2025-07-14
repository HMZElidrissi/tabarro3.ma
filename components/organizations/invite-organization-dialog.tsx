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
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { Role } from '@/types/enums';
import { inviteUser } from '@/actions/invitation';
import { useActionState } from 'react';
import { ActionState } from '@/auth/middleware';
import { Plus } from 'lucide-react';

interface InviteOrganizationDialogProps {
    onInviteSuccess?: () => void;
}

export function InviteOrganizationDialog({
    onInviteSuccess,
}: InviteOrganizationDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        inviteUser,
        { error: '', success: '' },
    );

    useEffect(() => {
        if (state?.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
        if (state?.success) {
            setOpen(false);
            toast({
                title: 'Success',
                description: state.success,
            });
            onInviteSuccess?.();
        }
    }, [state, toast]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Invite Organization
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite A New Partner</DialogTitle>
                    <DialogDescription>
                        Invite a new organization to join our partners. They
                        will receive an email invitation
                    </DialogDescription>
                </DialogHeader>
                <form action={formAction} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="email">Email address</label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter email address"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="role">Role</label>
                        <Select name="role" defaultValue={Role.ORGANIZATION}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={Role.ORGANIZATION}>
                                    Organization
                                </SelectItem>
                                <SelectItem value={Role.ADMIN}>
                                    Admin
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending}>
                            {pending ? 'Sending invite...' : 'Send Invitation'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
