'use client';

import { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { BloodRequest } from '@/types/blood-request';
import { useToast } from '@/hooks/use-toast';
import {
    ArrowLeft,
    Loader2,
    MapPin,
    Phone,
    Droplets,
    FileText,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { bloodGroups, getBloodGroupLabel } from '@/config/blood-group';
import { BloodGroup } from '@/types/enums';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { ActionState } from '@/auth/middleware';
import { createBloodRequest, updateBloodRequest } from '@/actions/profile';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ProgressLink as Link } from '@/components/custom/progress-link';
import { cn } from '@/lib/utils';

interface RequestFormProps {
    request?: BloodRequest | null;
    userId: string;
    mode: 'add' | 'edit';
    dict: any;
    isRTL?: boolean;
    /** When provided, called on success instead of redirecting (e.g. when form is in a sheet). */
    onSuccess?: () => void;
    /** When true, hides the back link (e.g. when embedded in a sheet that has its own close). */
    embedInSheet?: boolean;
}

export function RequestForm({
    request,
    userId,
    mode,
    dict,
    isRTL,
    onSuccess,
    embedInSheet,
}: RequestFormProps) {
    const router = useRouter();
    const { toast } = useToast();

    // When request comes from list (e.g. profile sheet), city may only have id — derive region from cityId
    const derivedRegion =
        request?.cityId != null && !request?.city?.regionId
            ? (REGIONS_AND_CITIES.find(r =>
                  r.cities.some(c => c.id === request.cityId),
              )?.id?.toString() ?? '')
            : '';
    const initialRegion =
        request?.city?.regionId?.toString() ?? derivedRegion ?? '';
    const initialCity = request?.cityId?.toString() ?? '';

    const [selectedRegion, setSelectedRegion] = useState<string>(initialRegion);
    const [selectedCityId, setSelectedCityId] = useState<string>(initialCity);

    // When region changes, clear city if it's not in the new region
    useEffect(() => {
        if (!selectedRegion) {
            setSelectedCityId('');
            return;
        }
        const region = REGIONS_AND_CITIES.find(
            r => r.id.toString() === selectedRegion,
        );
        const cityIdsInRegion = new Set(
            region?.cities.map(c => c.id.toString()) ?? [],
        );
        if (selectedCityId && !cityIdsInRegion.has(selectedCityId)) {
            setSelectedCityId('');
        }
    }, [selectedRegion]); // eslint-disable-line react-hooks/exhaustive-deps -- only when region changes

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
            if (onSuccess) {
                onSuccess();
            } else {
                router.push('/profile?tab=requests');
                router.refresh();
            }
        } else if (state.error) {
            toast({
                title: dict.common.error,
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast, router, dict, onSuccess]);

    const currentRegion = REGIONS_AND_CITIES.find(
        r => r.id.toString() === selectedRegion,
    );
    const cities = currentRegion?.cities ?? [];

    const formTitle =
        mode === 'add'
            ? dict.bloodRequests.newRequest
            : dict.bloodRequests.editRequest;
    const formDescription =
        mode === 'add'
            ? dict.bloodRequests.createRequestDescription
            : dict.bloodRequests.editRequestDescription;
    const submitLabel =
        mode === 'add'
            ? dict.bloodRequests.createRequest
            : dict.bloodRequests.updateRequest;
    const submitPendingLabel =
        mode === 'add'
            ? dict.bloodRequests.creating
            : dict.bloodRequests.updating;

    return (
        <Card className="border-0 shadow-md overflow-hidden">
            <CardHeader className="pb-4 border-b bg-muted/30">
                {!embedInSheet && (
                    <div
                        className={cn(
                            'flex items-center gap-2 mb-2',
                            isRTL && 'flex-row-reverse',
                        )}
                    >
                        <Link
                            href="/profile?tab=requests"
                            className="text-muted-foreground hover:text-foreground text-sm font-medium inline-flex items-center gap-1.5"
                        >
                            <ArrowLeft className="h-4 w-4 shrink-0" />
                            {dict.bloodRequests.myRequests}
                        </Link>
                    </div>
                )}
                <CardTitle className="text-xl">{formTitle}</CardTitle>
                <CardDescription>{formDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="userId" value={userId} />
                    {request && (
                        <input type="hidden" name="id" value={request.id} />
                    )}

                    {/* Section: Request details (blood group, status in edit) */}
                    <section
                        className="space-y-4"
                        aria-labelledby="request-details-heading"
                    >
                        <h2
                            id="request-details-heading"
                            className="text-sm font-semibold text-foreground flex items-center gap-2"
                        >
                            <Droplets className="h-4 w-4 text-brand-600" />
                            {dict.bloodRequests.requestDetails}
                        </h2>
                        <div
                            className={cn(
                                'grid gap-4',
                                mode === 'edit' && 'sm:grid-cols-2',
                            )}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="bloodGroup">
                                    {dict.forms.labels.bloodGroup}
                                </Label>
                                <Select
                                    name="bloodGroup"
                                    defaultValue={request?.bloodGroup ?? ''}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    required
                                >
                                    <SelectTrigger id="bloodGroup">
                                        <SelectValue
                                            placeholder={
                                                dict.forms.placeholders
                                                    .selectBloodGroup
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent className="w-full">
                                        {bloodGroups
                                            .filter(
                                                g =>
                                                    g.value !==
                                                    BloodGroup.UNKNOWN,
                                            )
                                            .map(group => (
                                                <SelectItem
                                                    key={group.value}
                                                    value={group.value}
                                                >
                                                    {getBloodGroupLabel(
                                                        group.value,
                                                        dict,
                                                        'request',
                                                    )}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {mode === 'edit' && (
                                <div className="space-y-2">
                                    <Label htmlFor="status">
                                        {dict.forms.labels.status}
                                    </Label>
                                    <Select
                                        name="status"
                                        defaultValue={
                                            request?.status ?? 'active'
                                        }
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    >
                                        <SelectTrigger id="status">
                                            <SelectValue
                                                placeholder={
                                                    dict.forms.placeholders
                                                        .selectStatus
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                {
                                                    dict.bloodRequests.status
                                                        .active
                                                }
                                            </SelectItem>
                                            <SelectItem value="fulfilled">
                                                {
                                                    dict.bloodRequests.status
                                                        .fulfilled
                                                }
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                {
                                                    dict.bloodRequests.status
                                                        .cancelled
                                                }
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Section: Location */}
                    <section
                        className="space-y-4"
                        aria-labelledby="location-heading"
                    >
                        <h2
                            id="location-heading"
                            className="text-sm font-semibold text-foreground flex items-center gap-2"
                        >
                            <MapPin className="h-4 w-4 text-brand-600" />
                            {dict.forms.labels.location}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="region">
                                    {dict.forms.labels.region}
                                </Label>
                                <Select
                                    value={selectedRegion}
                                    onValueChange={setSelectedRegion}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    required
                                >
                                    <SelectTrigger id="region">
                                        <SelectValue
                                            placeholder={
                                                dict.forms.placeholders
                                                    .selectRegion
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {REGIONS_AND_CITIES.map(region => (
                                            <SelectItem
                                                key={region.id}
                                                value={region.id.toString()}
                                            >
                                                {isRTL
                                                    ? region.nameAr
                                                    : region.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cityId">
                                    {dict.forms.labels.city}
                                </Label>
                                <Select
                                    name="cityId"
                                    value={selectedCityId}
                                    onValueChange={setSelectedCityId}
                                    dir={isRTL ? 'rtl' : 'ltr'}
                                    disabled={!selectedRegion}
                                    required
                                >
                                    <SelectTrigger id="cityId">
                                        <SelectValue
                                            placeholder={
                                                dict.forms.placeholders
                                                    .selectCity
                                            }
                                        />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map(city => (
                                            <SelectItem
                                                key={city.id}
                                                value={city.id.toString()}
                                            >
                                                {isRTL
                                                    ? city.nameAr
                                                    : city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">
                                {dict.forms.labels.location}
                            </Label>
                            <Input
                                id="location"
                                name="location"
                                defaultValue={request?.location ?? ''}
                                required
                                placeholder={
                                    dict.forms.placeholders.enterLocation
                                }
                                dir={isRTL ? 'rtl' : 'ltr'}
                                className="bg-background"
                            />
                        </div>
                    </section>

                    {/* Section: Contact */}
                    <section
                        className="space-y-4"
                        aria-labelledby="contact-heading"
                    >
                        <h2
                            id="contact-heading"
                            className="text-sm font-semibold text-foreground flex items-center gap-2"
                        >
                            <Phone className="h-4 w-4 text-brand-600" />
                            {dict.forms.labels.phoneNumber}
                        </h2>
                        <div className="space-y-2">
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                defaultValue={request?.phone ?? ''}
                                required
                                placeholder={
                                    dict.forms.placeholders.enterPhoneNumber
                                }
                                dir={isRTL ? 'rtl' : 'ltr'}
                                className="bg-background"
                            />
                        </div>
                    </section>

                    {/* Section: Description */}
                    <section
                        className="space-y-4"
                        aria-labelledby="description-heading"
                    >
                        <h2
                            id="description-heading"
                            className="text-sm font-semibold text-foreground flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4 text-brand-600" />
                            {dict.forms.labels.description}
                        </h2>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={request?.description ?? ''}
                            placeholder={
                                dict.forms.placeholders.enterDescription
                            }
                            rows={4}
                            dir={isRTL ? 'rtl' : 'ltr'}
                            className="bg-background resize-y min-h-[100px]"
                        />
                    </section>

                    {/* Actions */}
                    <div
                        className={cn(
                            'flex flex-col-reverse sm:flex-row gap-3 pt-2 border-t',
                            isRTL ? 'sm:flex-row-reverse' : '',
                        )}
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                embedInSheet && onSuccess
                                    ? onSuccess()
                                    : router.back()
                            }
                            className="sm:min-w-[120px]"
                        >
                            {dict.common.cancel}
                        </Button>
                        <Button
                            variant="default"
                            type="submit"
                            disabled={pending}
                            className="bg-brand-600 hover:bg-brand-700 text-white border-0 sm:min-w-[160px]"
                        >
                            {pending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />
                                    {submitPendingLabel}
                                </>
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
