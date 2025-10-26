'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { Button2 } from '@/components/ui/button';
import { Input, InputError } from '@/components/ui/input';
import { Label2 } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Loader2,
    User as UserIcon,
    Mail,
    Phone,
    CheckCircle,
} from 'lucide-react';
import { quickParticipate } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';
import { bloodGroups, getBloodGroupLabel } from '@/config/blood-group';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ActionState } from '@/auth/middleware';

interface ParticipateFormProps {
    campaign: Campaign;
    dict: any;
    isRTL?: boolean;
}

export function ParticipateForm({
    campaign,
    dict,
    isRTL,
}: ParticipateFormProps) {
    const router = useRouter();
    const [state, action, isPending] = useActionState<ActionState, FormData>(
        quickParticipate,
        {
            error: '',
            success: '',
        },
    );

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bloodGroup: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            bloodGroup: value,
        }));
    };

    // Handle success redirect
    useEffect(() => {
        if (!!state.success) {
            // Delay redirect to show success message
            const timer = setTimeout(() => {
                router.push('/campaigns');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [state.success, router, campaign.id]);

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="campaignId" value={campaign.id} />
            <input type="hidden" name="cityId" value={campaign.cityId} />

            {!!state.success && (
                <Alert className="border-green-600/50 bg-green-50 dark:bg-green-950/20">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-400">
                        <div className="font-medium mb-1">
                            {dict.participate.successTitle}
                        </div>
                        <div>{dict.participate.successMessage}</div>
                    </AlertDescription>
                </Alert>
            )}

            {state.error && (
                <Alert variant="destructive">
                    <AlertDescription>{state.error}</AlertDescription>
                </Alert>
            )}

            <div>
                <Label2 htmlFor="name">
                    {dict.forms.labels.fullName}{' '}
                    <span className="text-red-500">*</span>
                </Label2>
                <div className="relative">
                    <UserIcon
                        className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`}
                    />
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!!state.success}
                        placeholder={dict.forms.placeholders.enterFullName}
                        className={isRTL ? 'pr-10' : 'pl-10'}
                    />
                </div>
            </div>

            <div>
                <Label2 htmlFor="email">
                    {dict.forms.labels.email}{' '}
                    <span className="text-red-500">*</span>
                </Label2>
                <div className="relative">
                    <Mail
                        className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`}
                    />
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!!state.success}
                        placeholder={dict.forms.placeholders.enterEmail}
                        className={isRTL ? 'pr-10' : 'pl-10'}
                    />
                </div>
            </div>

            <div>
                <Label2 htmlFor="phone">
                    {dict.forms.labels.phoneNumber}{' '}
                    <span className="text-red-500">*</span>
                </Label2>
                <div className="relative">
                    <Phone
                        className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`}
                    />
                    <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        dir={isRTL ? 'rtl' : 'ltr'}
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!!state.success}
                        placeholder={dict.forms.placeholders.enterPhoneNumber}
                        className={isRTL ? 'pr-10' : 'pl-10'}
                    />
                </div>
            </div>

            <div>
                <Label2 htmlFor="bloodGroup">
                    {dict.forms.labels.bloodGroup}{' '}
                    <span className="text-red-500">*</span>
                </Label2>
                <Select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onValueChange={handleSelectChange}
                    disabled={!!state.success}
                    dir={isRTL ? 'rtl' : 'ltr'}
                    required>
                    <SelectTrigger>
                        <SelectValue
                            placeholder={
                                dict.forms.placeholders.selectBloodGroup
                            }
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {bloodGroups.map(group => (
                            <SelectItem key={group.value} value={group.value}>
                                {getBloodGroupLabel(group.value, dict)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex items-center justify-end">
                <Button2
                    type="submit"
                    className="w-full justify-center"
                    disabled={isPending || !!state.success}>
                    {isPending ? (
                        <>
                            <Loader2
                                className={`h-4 w-4 animate-spin ${isRTL ? 'ml-2' : 'mr-2'}`}
                            />
                            {dict.participate.participating}
                        </>
                    ) : (
                        dict.participate.participateButton
                    )}
                </Button2>
            </div>

            <p className="text-xs text-center text-muted-foreground">
                {dict.participate.consentMessage}
            </p>
        </form>
    );
}
