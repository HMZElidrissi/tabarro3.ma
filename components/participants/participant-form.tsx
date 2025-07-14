'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label, Label2 } from '@/components/ui/label';
import { Loader2, Terminal } from 'lucide-react';
import { User } from '@/types/user';
import { ActionState } from '@/auth/middleware';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { bloodGroups } from '@/config/blood-group';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { REGIONS_AND_CITIES } from '@/config/locations';

interface ParticipantFormProps {
    participant?: User;
    action: (prevState: any, formData: FormData) => Promise<ActionState>;
    mode: 'add' | 'edit';
}

export default function ParticipantForm({
    participant,
    action,
    mode,
}: ParticipantFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>(
        mode === 'edit' ? participant?.city?.regionId?.toString() || '' : '',
    );
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        action,
        { error: '', success: '' },
    );

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Success',
                description: state.success,
            });
            router.push('/dashboard/participants');
        } else if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {mode === 'add'
                        ? 'Add New Participant'
                        : 'Edit Participant'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {mode === 'add' && (
                    <Alert>
                        <Terminal className="h-4 w-4" />
                        <AlertTitle>Heads up!</AlertTitle>
                        <AlertDescription>
                            The new participant can sign in using the email and
                            his email as the password.
                        </AlertDescription>
                    </Alert>
                )}
                <form ref={formRef} action={formAction} className="space-y-4">
                    <input type="hidden" name="id" value={participant?.id} />

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={participant?.name || ''}
                            required
                            placeholder="Enter name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={participant?.email || ''}
                            required
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            defaultValue={participant?.phone || ''}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                            name="bloodGroup"
                            defaultValue={participant?.bloodGroup || ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                {bloodGroups.map(group => (
                                    <SelectItem
                                        key={group.value}
                                        value={group.value}
                                    >
                                        {group.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label2 htmlFor="region">Region</Label2>
                        <Select
                            name="region"
                            defaultValue={
                                participant?.city?.regionId.toString() || ''
                            }
                            onValueChange={(value: string) => {
                                setSelectedRegion(value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your region" />
                            </SelectTrigger>
                            <SelectContent>
                                {REGIONS_AND_CITIES.map(region => (
                                    <SelectItem
                                        key={region.id}
                                        value={region.id.toString()}
                                    >
                                        {region.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label2 htmlFor="cityId">City</Label2>
                        <Select
                            name="cityId"
                            defaultValue={participant?.cityId?.toString() || ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select your city" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedRegion &&
                                    REGIONS_AND_CITIES.find(
                                        r => r.id.toString() === selectedRegion,
                                    )?.cities.map(city => (
                                        <SelectItem
                                            key={city.id}
                                            value={city.id.toString()}
                                        >
                                            {city.name}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                router.push('/dashboard/participants')
                            }
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={pending}>
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {mode === 'add'
                                        ? 'Adding...'
                                        : 'Updating...'}
                                </>
                            ) : mode === 'add' ? (
                                'Add Participant'
                            ) : (
                                'Update Participant'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
