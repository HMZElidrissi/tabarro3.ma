'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateProfile } from '@/actions/profile';
import { User } from '@/types/user';
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

interface AccountFormProps {
    user: User;
    dict: any;
    isRTL?: boolean;
}

export function AccountForm({ user, dict, isRTL }: AccountFormProps) {
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>(
        user.city?.regionId?.toString() || '',
    );
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        updateProfile,
        {
            error: '',
            success: '',
        },
    );

    useEffect(() => {
        if (state.success) {
            toast({
                title: dict.common.success,
                description: state.success,
            });
        } else if (state.error) {
            toast({
                title: dict.common.error,
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast, dict]);

    return (
        <form ref={formRef} action={formAction}>
            <CardHeader>
                <CardTitle>{dict.profile.accountInformation}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">{dict.forms.labels.fullName}</Label>
                    <Input
                        id="name"
                        name="name"
                        defaultValue={user.name || ''}
                        required
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{dict.forms.labels.email}</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        disabled
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
                        defaultValue={user.phone || ''}
                        type="tel"
                        placeholder={dict.forms.placeholders.enterPhoneNumber}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="bloodGroup">
                        {dict.forms.labels.bloodGroup}
                    </Label>
                    <Select
                        name="bloodGroup"
                        defaultValue={user.bloodGroup || ''}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
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
                        onValueChange={(value: string) => {
                            setSelectedRegion(value);
                        }}
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
                                    {isRTL
                                        ? region.nameAr
                                        : region.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="cityId">{dict.forms.labels.city}</Label>
                    <Select
                        name="cityId"
                        defaultValue={user.cityId?.toString()}
                        dir={isRTL ? 'rtl' : 'ltr'}
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
                                        {isRTL
                                            ? city.nameAr
                                            : city.name}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="brand" type="submit" disabled={pending}>
                    {pending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {dict.common.saving}
                        </>
                    ) : (
                        dict.common.saveChanges
                    )}
                </Button>
            </CardFooter>
        </form>
    );
}
