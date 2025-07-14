'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BloodGroup } from '@/types/enums';
import { bloodGroups } from '@/config/blood-group';

export function ParticipantFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') ?? '';
    const currentBloodGroup =
        (searchParams.get('bloodGroup') as BloodGroup | 'all') ?? 'all';

    const handleBloodGroupChange = (value: string) => {
        router.push(
            `${pathname}?${createQueryString({
                bloodGroup: value,
                page: '1',
            })}`,
        );
    };

    const handleSearch = (term: string) => {
        router.push(
            `${pathname}?${createQueryString({
                search: term,
                page: '1',
            })}`,
        );
    };

    const createQueryString = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            if (!value) {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        return newParams.toString();
    };

    const debouncedSearch = useDebouncedCallback(handleSearch, 300);

    return (
        <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="search">Search</Label>
                    <Input
                        id="search"
                        placeholder="Search by name..."
                        defaultValue={currentSearch}
                        onChange={e => debouncedSearch(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Blood Group</Label>
                    <Select
                        value={currentBloodGroup}
                        onValueChange={handleBloodGroupChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by blood group" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Blood Groups
                            </SelectItem>
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

                {(currentSearch || currentBloodGroup !== 'all') && (
                    <div className="flex items-end">
                        <Button
                            variant="ghost"
                            onClick={() => router.push(pathname)}
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
