'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { BloodRequest } from '@/types/blood-request';
import { ActionState } from '@/auth/middleware';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { BloodGroup } from '@/types/enums';
import { getBloodGroupLabel } from '@/config/blood-group';

interface BloodRequestFormProps {
    request?: BloodRequest;
    action: (prevState: any, formData: FormData) => Promise<ActionState>;
    mode: 'add' | 'edit';
}

const REQUEST_STATUS = ['active', 'fulfilled', 'cancelled'] as const;

export default function BloodRequestForm({
    request,
    action,
    mode,
}: BloodRequestFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>(
        mode === 'edit' ? request?.city?.regionId?.toString() || '' : '',
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
            router.push('/dashboard/requests');
        } else if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
            console.error(state.error);
        }
    }, [state, toast, router]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {mode === 'add' ? 'Add New Request' : 'Edit Request'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <input type="hidden" name="id" value={request?.id} />

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={request?.description || ''}
                            required
                            placeholder="Enter request description"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bloodGroup">Blood Group</Label>
                        <Select
                            name="bloodGroup"
                            defaultValue={request?.bloodGroup || ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.values(BloodGroup).map(group => (
                                    <SelectItem key={group} value={group}>
                                        {getBloodGroupLabel(
                                            group,
                                            null,
                                            'request',
                                        )}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="region">Region</Label>
                        <Select
                            name="region"
                            defaultValue={
                                request?.city?.regionId?.toString() || ''
                            }
                            onValueChange={(value: string) => {
                                setSelectedRegion(value);
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select region" />
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
                        <Label htmlFor="cityId">City</Label>
                        <Select
                            name="cityId"
                            defaultValue={request?.cityId?.toString() || ''}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select city" />
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

                    <div className="space-y-2">
                        <Label htmlFor="location">Location Details</Label>
                        <Input
                            id="location"
                            name="location"
                            defaultValue={request?.location || ''}
                            placeholder="Enter specific location"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={request?.phone || ''}
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            defaultValue={request?.status || 'active'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {REQUEST_STATUS.map(status => (
                                    <SelectItem key={status} value={status}>
                                        {status.toUpperCase()}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/dashboard/requests')}
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
                                'Add Request'
                            ) : (
                                'Update Request'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
