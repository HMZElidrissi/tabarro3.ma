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
import { Check, ChevronsUpDown } from 'lucide-react';
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
                                    onOpenChange={setOrgOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={orgOpen}
                                            className="w-full justify-between">
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
                                                            }}>
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
                            }}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                {REGIONS_AND_CITIES.map(region => (
                                    <SelectItem
                                        key={region.id}
                                        value={region.id.toString()}>
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
                            defaultValue={campaign?.cityId?.toString() || ''}>
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
                                            value={city.id.toString()}>
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

                    <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                            id="startTime"
                            name="startTime"
                            type="datetime-local"
                            defaultValue={
                                campaign?.startTime
                                    ? new Date(campaign.startTime)
                                          .toISOString()
                                          .slice(0, 16)
                                    : ''
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                            id="endTime"
                            name="endTime"
                            type="datetime-local"
                            defaultValue={
                                campaign?.endTime
                                    ? new Date(campaign.endTime)
                                          .toISOString()
                                          .slice(0, 16)
                                    : ''
                            }
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push('/dashboard/campaigns')}>
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
