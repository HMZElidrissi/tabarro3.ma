'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BloodRequest } from '@/types/blood-request';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { bloodGroups, getBloodGroupLabel } from '@/config/blood-group';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { ActionState } from '@/auth/middleware';
import { createBloodRequest, updateBloodRequest } from '@/actions/profile';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

interface RequestFormProps {
    request?: BloodRequest | null;
    userId: string;
    mode: 'add' | 'edit';
    dict: any;
    isRTL?: boolean;
}

export function RequestForm({
    request,
    userId,
    mode,
    dict,
    isRTL,
}: RequestFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedRegion, setSelectedRegion] = useState<string>(
        request?.city?.regionId?.toString() || '',
    );

    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        mode === 'edit' ? updateBloodRequest : createBloodRequest,
        { error: '', success: '' },
    );

    useEffect(() => {
        if (state.success) {
            toast({
                title: dict.common.success,
                description: state.success,
            });
            router.push('/profile?tab=requests');
            router.refresh();
        } else if (state.error) {
            toast({
                title: dict.common.error,
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast, router, dict]);

    return (
        <Card className="p-6">
            <form action={formAction} className="space-y-4">
                <input type="hidden" name="userId" value={userId} />
                {request && (
                    <input type="hidden" name="id" value={request.id} />
                )}

                <div className="space-y-2">
                    <Label htmlFor="bloodGroup">
                        {dict.forms.labels.bloodGroup}
                    </Label>
                    <Select
                        name="bloodGroup"
                        defaultValue={request?.bloodGroup || ''}
                        dir={isRTL ? 'rtl' : 'ltr'}>
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    dict.forms.placeholders.selectBloodGroup
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {bloodGroups.map(group => (
                                <SelectItem
                                    key={group.value}
                                    value={group.value}>
                                    {getBloodGroupLabel(group.value, dict)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="region">{dict.forms.labels.region}</Label>
                    <Select
                        value={selectedRegion}
                        onValueChange={setSelectedRegion}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={
                                    dict.forms.placeholders.selectRegion
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {REGIONS_AND_CITIES.map(region => (
                                <SelectItem
                                    key={region.id}
                                    value={region.id.toString()}>
                                    {isRTL ? region.nameAr : region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cityId">{dict.forms.labels.city}</Label>
                    <Select
                        name="cityId"
                        defaultValue={request?.cityId?.toString() || ''}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        disabled={!selectedRegion}
                    >
                        <SelectTrigger>
                            <SelectValue
                                placeholder={dict.forms.placeholders.selectCity}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {selectedRegion &&
                                REGIONS_AND_CITIES.find(
                                    r => r.id.toString() === selectedRegion,
                                )?.cities.map(city => (
                                    <SelectItem
                                        key={city.id}
                                        value={city.id.toString()}>
                                        {isRTL ? city.nameAr : city.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location">
                        {dict.forms.labels.location}
                    </Label>
                    <Input
                        id="location"
                        name="location"
                        defaultValue={request?.location || ''}
                        required
                        placeholder={dict.forms.placeholders.enterLocation}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">
                        {dict.forms.labels.phoneNumber}
                    </Label>
                    <Input
                        id="phone"
                        name="phone"
                        defaultValue={request?.phone || ''}
                        required
                        placeholder={dict.forms.placeholders.enterPhoneNumber}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">
                        {dict.forms.labels.description}
                    </Label>
                    <Textarea
                        id="description"
                        name="description"
                        defaultValue={request?.description || ''}
                        placeholder={dict.forms.placeholders.enterDescription}
                        rows={3}
                    />
                </div>

                {mode === 'edit' && (
                    <div className="space-y-2">
                        <Label htmlFor="status">
                            {dict.forms.labels.status}
                        </Label>
                        <Select
                            name="status"
                            defaultValue={request?.status || 'active'}
                            dir={isRTL ? 'rtl' : 'ltr'}>
                            <SelectTrigger>
                                <SelectValue
                                    placeholder={
                                        dict.forms.placeholders.selectStatus
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">
                                    {dict.bloodRequests.status.active}
                                </SelectItem>
                                <SelectItem value="fulfilled">
                                    {dict.bloodRequests.status.fulfilled}
                                </SelectItem>
                                <SelectItem value="cancelled">
                                    {dict.bloodRequests.status.cancelled}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}>
                        {dict.common.cancel}
                    </Button>
                    <Button variant="brand" type="submit" disabled={pending}>
                        {pending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === 'add'
                                    ? dict.bloodRequests.creating
                                    : dict.bloodRequests.updating}
                            </>
                        ) : mode === 'add' ? (
                            dict.bloodRequests.createRequest
                        ) : (
                            dict.bloodRequests.updateRequest
                        )}
                    </Button>
                </div>
            </form>
        </Card>
    );
}
