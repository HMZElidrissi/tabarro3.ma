'use client';

import { CampaignCard } from '@/components/campaigns/campaign-card';
import { Campaign } from '@/types/campaign';
import { PaginationControls } from '@/components/custom/pagination-controls';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CampaignsListProps {
    campaigns: Campaign[];
    authenticated: boolean;
    userId?: string;
    dict: any;
    totalPages: number;
    currentPage: number;
    total: number;
}

export default function CampaignsList({
    campaigns,
    authenticated,
    userId,
    dict,
    totalPages,
    currentPage,
    total,
}: CampaignsListProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read filter values from URL search params
    const selectedRegion = searchParams.get('region') || '';
    const selectedCity = searchParams.get('city') || '';

    // Create query string helper
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

    const handlePageChange = (page: number) => {
        router.push(
            `${pathname}?${createQueryString({
                page: page.toString(),
            })}`,
        );
    };

    // Update region and city filter handlers to update the URL search params
    const handleRegionChange = (value: string) => {
        if (value === 'all') {
            router.push(
                `${pathname}?${createQueryString({
                    region: '',
                    city: '',
                    page: '1',
                })}`,
            );
        } else {
            router.push(
                `${pathname}?${createQueryString({
                    region: value,
                    city: '',
                    page: '1',
                })}`,
            );
        }
    };

    const handleCityChange = (value: string) => {
        if (value === 'all') {
            router.push(
                `${pathname}?${createQueryString({
                    city: '',
                    page: '1',
                })}`,
            );
        } else {
            router.push(
                `${pathname}?${createQueryString({
                    city: value,
                    page: '1',
                })}`,
            );
        }
    };

    const handleResetFilters = () => {
        router.push(pathname);
    };

    // Filter cities based on selected region
    const cities = selectedRegion
        ? REGIONS_AND_CITIES.find(r => r.id.toString() === selectedRegion)
              ?.cities || []
        : [];

    return (
        <div className="container mx-auto py-8">
            <div className="text-center mb-16 relative">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-10">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-brand-600">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                    {dict.New_Campaigns}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    {dict.New_Campaigns_Description}
                </p>
                <div className="mt-8 w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>

                {/* Centered Filters Below Title and Line */}
                <div className="flex justify-center mt-8">
                    <div className="w-full max-w-3xl">
                        {/* Filters - Dashboard style */}
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                {/* Region Filter */}
                                <div className="space-y-2">
                                    <Label>
                                        {dict.forms?.labels?.region ||
                                            dict.Region ||
                                            'Region'}
                                    </Label>
                                    <Select
                                        value={selectedRegion || 'all'}
                                        onValueChange={handleRegionChange}>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    dict.forms?.placeholders
                                                        ?.selectRegion ||
                                                    dict.All_Regions ||
                                                    'All Regions'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {dict.All_Regions ||
                                                    'All Regions'}
                                            </SelectItem>
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

                                {/* City Filter */}
                                <div className="space-y-2">
                                    <Label>
                                        {dict.forms?.labels?.city ||
                                            dict.City ||
                                            'City'}
                                    </Label>
                                    <Select
                                        value={selectedCity || 'all'}
                                        onValueChange={handleCityChange}
                                        disabled={
                                            !selectedRegion ||
                                            selectedRegion === 'all'
                                        }>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    dict.forms?.placeholders
                                                        ?.selectCity ||
                                                    dict.All_Cities ||
                                                    'All Cities'
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                {dict.All_Cities ||
                                                    'All Cities'}
                                            </SelectItem>
                                            {cities.map(city => (
                                                <SelectItem
                                                    key={city.id}
                                                    value={city.id.toString()}>
                                                    {city.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Reset Filters */}
                                {(selectedRegion || selectedCity) && (
                                    <div className="flex items-end">
                                        <Button
                                            variant="ghost"
                                            onClick={handleResetFilters}
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 w-full">
                                            <X className="w-4 h-4 mr-2" />
                                            {dict.Reset_Filters ||
                                                dict.Clear_Filters ||
                                                'Clear Filters'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-12">
                {campaigns.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {dict.No_campaigns_found}
                        </p>
                    </div>
                )}

                {(() => {
                    const ongoingCampaigns = campaigns.filter(
                        campaign =>
                            new Date(campaign.startTime) <= new Date() &&
                            new Date(campaign.endTime) >= new Date(),
                    );
                    const upcomingCampaigns = campaigns.filter(
                        campaign => new Date(campaign.startTime) > new Date(),
                    );
                    const pastCampaigns = campaigns.filter(
                        campaign => new Date(campaign.endTime) < new Date(),
                    );
                    return (
                        <>
                            {ongoingCampaigns.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold">
                                        {dict.Ongoing_Campaigns}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {ongoingCampaigns.map(campaign => (
                                            <CampaignCard
                                                key={campaign.id}
                                                campaign={campaign}
                                                authenticated={authenticated}
                                                userId={userId}
                                                dict={dict}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {upcomingCampaigns.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold">
                                        {dict.Upcoming_Campaigns}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {upcomingCampaigns.map(campaign => (
                                            <CampaignCard
                                                key={campaign.id}
                                                campaign={campaign}
                                                authenticated={authenticated}
                                                userId={userId}
                                                dict={dict}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {pastCampaigns.length > 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-semibold">
                                        {dict.Past_Campaigns}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {pastCampaigns.map(campaign => (
                                            <CampaignCard
                                                key={campaign.id}
                                                campaign={campaign}
                                                authenticated={authenticated}
                                                userId={userId}
                                                dict={dict}
                                                passed={true}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}

                {totalPages > 1 && (
                    <div className="flex justify-center">
                        <PaginationControls
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            dict={dict}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
