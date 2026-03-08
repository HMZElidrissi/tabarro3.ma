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
import { PageHeader } from '@/components/custom/page-header';

interface CampaignsListProps {
    campaigns: Campaign[];
    authenticated: boolean;
    userId?: string;
    dict: any;
    isRTL?: boolean;
    totalPages: number;
    currentPage: number;
    total: number;
}

export default function CampaignsList({
    campaigns,
    authenticated,
    userId,
    dict,
    isRTL,
    totalPages,
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
            <PageHeader
                title={dict.New_Campaigns}
                description={dict.New_Campaigns_Description}
            >
                <div className="flex justify-center">
                    <div className="w-full max-w-3xl">
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>
                                        {dict.forms?.labels?.region ||
                                            dict.Region ||
                                            'Region'}
                                    </Label>
                                    <Select
                                        value={selectedRegion || 'all'}
                                        onValueChange={handleRegionChange}
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    >
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
                                        }
                                        dir={isRTL ? 'rtl' : 'ltr'}
                                    >
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
                            {(selectedRegion || selectedCity) && (
                                <div className="flex items-end">
                                    <Button
                                        variant="ghost"
                                        onClick={handleResetFilters}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-500 dark:hover:bg-red-900/20 w-full"
                                    >
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
            </PageHeader>

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
                                    <h2 className="text-2xl font-semibold text-foreground">
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
                                    <h2 className="text-2xl font-semibold text-foreground">
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
                                    <h2 className="text-2xl font-semibold text-foreground">
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
