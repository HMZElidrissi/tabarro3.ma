'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { Campaign } from '@/types/campaign';
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
import { User } from '@/types/user';
import { Role } from '@/types/enums';
import { Check, ChevronsUpDown, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Calendar } from '@/components/ui/calendar';
import {
    Field,
    FieldGroup,
    FieldLabel,
} from '@/components/ui/field';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { format } from 'date-fns';

interface CampaignFormProps {
    campaign?: Campaign;
    organizations?: User[];
    action: (prevState: any, formData: FormData) => Promise<ActionState>;
    mode: 'add' | 'edit';
    userRole: Role;
    organizationId?: string;
}

export default function CampaignForm({
    campaign,
    organizations,
    action,
    mode,
    userRole,
    organizationId,
}: CampaignFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const formRef = useRef<HTMLFormElement>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>(
        mode === 'edit' ? campaign?.city?.regionId?.toString() || '' : '',
    );
    const [state, formAction, pending] = useActionState<ActionState, FormData>(
        action,
        { error: '', success: '' },
    );

    const [orgOpen, setOrgOpen] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<string>(
        campaign?.organizationId || '',
    );

    const [startCalOpen, setStartCalOpen] = useState(false);
    const [endCalOpen, setEndCalOpen] = useState(false);

    const [startDate, setStartDate] = useState<Date | undefined>(
        campaign?.startTime ? new Date(campaign.startTime) : undefined,
    );
    const [startTimeStr, setStartTimeStr] = useState<string>(
        campaign?.startTime
            ? format(new Date(campaign.startTime), 'HH:mm')
            : '09:00',
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        campaign?.endTime ? new Date(campaign.endTime) : undefined,
    );
    const [endTimeStr, setEndTimeStr] = useState<string>(
        campaign?.endTime
            ? format(new Date(campaign.endTime), 'HH:mm')
            : '18:00',
    );

    const startDateTimeISO =
        startDate && startTimeStr
            ? `${format(startDate, 'yyyy-MM-dd')}T${startTimeStr}`
            : '';
    const endDateTimeISO =
        endDate && endTimeStr
            ? `${format(endDate, 'yyyy-MM-dd')}T${endTimeStr}`
            : '';

    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Success',
                description: state.success,
            });
            router.push('/dashboard/campaigns');
        } else if (state.error) {
            toast({
                title: 'Error',
                description: state.error,
                variant: 'destructive',
            });
        }
    }, [state, toast, router]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {mode === 'add' ? 'Add New Campaign' : 'Edit Campaign'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form ref={formRef} action={formAction} className="space-y-4">
                    <input type="hidden" name="id" value={campaign?.id} />
                    {organizationId && (
                        <input
                            type="hidden"
                            name="organizationId"
                            value={organizationId}
                        />
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Campaign Name</Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={campaign?.name || ''}
                            required
                            placeholder="Enter campaign name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={campaign?.description || ''}
                            required
                            placeholder="Enter campaign description"
                        />
                    </div>
                    {userRole === Role.ADMIN &&
                        organizations &&
                        organizations.length > 0 && (
                            <div className="space-y-2">
                                <Label htmlFor="organizationId">
                                    Organization
                                </Label>
                                <Popover
                                    open={orgOpen}
                                    onOpenChange={setOrgOpen}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={orgOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedOrg
                                                ? organizations.find(
                                                      org =>
                                                          org.id ===
                                                          selectedOrg,
                                                  )?.name
                                                : 'Select organization...'}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput
                                                placeholder="Search organization..."
                                                className="h-9"
                                            />
                                            <CommandList>
                                                <CommandEmpty>
                                                    No organization found.
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {organizations.map(org => (
                                                        <CommandItem
                                                            key={org.id}
                                                            value={org.id}
                                                            onSelect={currentValue => {
                                                                setSelectedOrg(
                                                                    currentValue ===
                                                                        selectedOrg
                                                                        ? ''
                                                                        : currentValue,
                                                                );
                                                                setOrgOpen(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            {org.name}
                                                            <Check
                                                                className={cn(
                                                                    'ml-auto h-4 w-4',
                                                                    selectedOrg ===
                                                                        org.id
                                                                        ? 'opacity-100'
                                                                        : 'opacity-0',
                                                                )}
                                                            />
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <input
                                    type="hidden"
                                    name="organizationId"
                                    value={selectedOrg}
                                />
                            </div>
                        )}

                    <div>
                        <Label htmlFor="region">Region</Label>
                        <Select
                            name="region"
                            defaultValue={
                                campaign?.city?.regionId?.toString() || ''
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
                            defaultValue={campaign?.cityId?.toString() || ''}
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
                            defaultValue={campaign?.location || ''}
                            required
                            placeholder="Enter specific location"
                        />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Start date &amp; time</Label>
                            <input
                                type="hidden"
                                name="startTime"
                                value={startDateTimeISO}
                                required
                            />
                            <Popover open={startCalOpen} onOpenChange={setStartCalOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        type="button"
                                    >
                                        <Clock className="mr-2 size-4 text-muted-foreground" />
                                        {startDate
                                            ? `${format(startDate, 'PPP')} – ${startTimeStr}`
                                            : 'Pick a start date & time'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={setStartDate}
                                        initialFocus
                                    />
                                    <div className="border-t p-3">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="time-start">
                                                    Start time
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="time-start"
                                                        type="time"
                                                        step="1"
                                                        value={startTimeStr}
                                                        onChange={e =>
                                                            setStartTimeStr(e.target.value)
                                                        }
                                                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                        required
                                                    />
                                                    <InputGroupAddon>
                                                        <Clock className="size-4 text-muted-foreground" />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Field>
                                        </FieldGroup>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="mt-2 w-full"
                                            onClick={() => setStartCalOpen(false)}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>End date &amp; time</Label>
                            <input
                                type="hidden"
                                name="endTime"
                                value={endDateTimeISO}
                                required
                            />
                            <Popover open={endCalOpen} onOpenChange={setEndCalOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal"
                                        type="button"
                                    >
                                        <Clock className="mr-2 size-4 text-muted-foreground" />
                                        {endDate
                                            ? `${format(endDate, 'PPP')} – ${endTimeStr}`
                                            : 'Pick an end date & time'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={setEndDate}
                                        initialFocus
                                    />
                                    <div className="border-t p-3">
                                        <FieldGroup>
                                            <Field>
                                                <FieldLabel htmlFor="time-end">
                                                    End time
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="time-end"
                                                        type="time"
                                                        step="1"
                                                        value={endTimeStr}
                                                        onChange={e =>
                                                            setEndTimeStr(e.target.value)
                                                        }
                                                        className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                                        required
                                                    />
                                                    <InputGroupAddon>
                                                        <Clock className="size-4 text-muted-foreground" />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                            </Field>
                                        </FieldGroup>
                                        <Button
                                            type="button"
                                            size="sm"
                                            className="mt-2 w-full"
                                            onClick={() => setEndCalOpen(false)}
                                        >
                                            Done
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/dashboard/campaigns')}
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
                                'Add Campaign'
                            ) : (
                                'Update Campaign'
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
