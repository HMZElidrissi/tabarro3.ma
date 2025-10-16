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
import { REGIONS_AND_CITIES } from '@/config/locations';
import { useState, useEffect } from 'react';
import { Role } from '@/types/enums';

export function OrganizationFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentSearch = searchParams.get('search') ?? '';
    const currentRegion = searchParams.get('region') ?? '';
    const currentCityId = searchParams.get('cityId') ?? '';
    const currentRole = searchParams.get('role') ?? 'all';

    const [selectedRegion, setSelectedRegion] = useState(currentRegion);
    const [selectedCity, setSelectedCity] = useState(currentCityId);
    const [selectedRole, setSelectedRole] = useState(currentRole);

    useEffect(() => {
        setSelectedRegion(currentRegion);
    }, [currentRegion]);
    useEffect(() => {
        setSelectedCity(currentCityId);
    }, [currentCityId]);
    useEffect(() => {
        setSelectedRole(currentRole);
    }, [currentRole]);

    const handleRegionChange = (value: string) => {
        if (value === 'all') {
            setSelectedRegion('all');
            setSelectedCity('all');
            router.push(
                `${pathname}?${createQueryString({
                    region: '',
                    cityId: '',
                    page: '1',
                })}`,
            );
        } else {
            setSelectedRegion(value);
            setSelectedCity('all');
            router.push(
                `${pathname}?${createQueryString({
                    region: value,
                    cityId: '',
                    page: '1',
                })}`,
            );
        }
    };

    const handleCityChange = (value: string) => {
        if (value === 'all') {
            setSelectedCity('all');
            router.push(
                `${pathname}?${createQueryString({
                    cityId: '',
                    page: '1',
                })}`,
            );
        } else {
            setSelectedCity(value);
            router.push(
                `${pathname}?${createQueryString({
                    cityId: value,
                    page: '1',
                })}`,
            );
        }
    };

    const handleRoleChange = (value: string) => {
        if (value === 'all') {
            setSelectedRole('all');
            router.push(
                `${pathname}?${createQueryString({
                    role: '',
                    page: '1',
                })}`,
            );
        } else {
            setSelectedRole(value);
            router.push(
                `${pathname}?${createQueryString({
                    role: value,
                    page: '1',
                })}`,
            );
        }
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
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-2">
                    <Label>Search</Label>
                    <Input
                        placeholder="Search organizations and admins..."
                        defaultValue={currentSearch}
                        onChange={e => debouncedSearch(e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Region</Label>
                    <Select
                        value={selectedRegion || 'all'}
                        onValueChange={handleRegionChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by region" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Regions</SelectItem>
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

                <div className="space-y-2">
                    <Label>City</Label>
                    <Select
                        value={selectedCity || 'all'}
                        onValueChange={handleCityChange}
                        disabled={!selectedRegion || selectedRegion === 'all'}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by city" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {selectedRegion &&
                                selectedRegion !== 'all' &&
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
                    <Label>Role</Label>
                    <Select
                        value={selectedRole}
                        onValueChange={handleRoleChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value={Role.ADMIN}>Admin</SelectItem>
                            <SelectItem value={Role.ORGANIZATION}>
                                Organization
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {(currentSearch ||
                    selectedRegion !== 'all' ||
                    selectedCity !== 'all' ||
                    selectedRole !== 'all') && (
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
