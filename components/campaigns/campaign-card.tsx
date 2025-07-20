'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Phone, User, Clock } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { participateInCampaign } from '@/actions/home';
import { format } from 'date-fns';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';

interface CampaignCardProps {
    campaign: Campaign;
    authenticated: boolean;
    userId?: string;
    dict: any;
    passed?: boolean;
}

export function CampaignCard({
    campaign,
    authenticated,
    userId,
    dict,
    passed = false,
}: CampaignCardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    const isParticipating = campaign.participants.some(
        p => p.userId === userId,
    );

    const handleParticipate = async () => {
        if (!authenticated) {
            router.push('/sign-in');
            return;
        }
        setDialogOpen(true);
    };

    const confirmParticipation = async () => {
        try {
            setIsLoading(true);
            await participateInCampaign(campaign.id, userId!);
            router.refresh();
        } catch (error) {
            console.error('Error participating in campaign:', error);
        } finally {
            setIsLoading(false);
            setDialogOpen(false);
        }
    };

    const isUpcoming = new Date(campaign.startTime) > new Date();
    const isPast = new Date(campaign.endTime) < new Date();
    const isOngoing =
        new Date(campaign.startTime) <= new Date() &&
        new Date(campaign.endTime) >= new Date();

    const getStatusBadge = () => {
        if (isOngoing) {
            return {
                text: dict.Ongoing,
                className: 'bg-green-100 text-green-700 border-green-200',
            };
        }
        if (isUpcoming) {
            return {
                text: dict.Upcoming,
                className: 'bg-blue-100 text-blue-700 border-blue-200',
            };
        }
        return {
            text: dict.Past,
            className: 'bg-gray-100 text-gray-600 border-gray-200',
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <>
            <Card className="group h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-white/50 backdrop-blur-sm">
                <CardContent className="flex-1 p-4">
                    {/* Header with status badge */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                        <Badge
                            variant="outline"
                            className={cn(
                                'text-xs font-medium px-2 py-1 shrink-0',
                                statusBadge.className,
                            )}>
                            <Clock className="w-3 h-3 me-1" />
                            {statusBadge.text}
                        </Badge>
                        {isParticipating && (
                            <Badge
                                variant="outline"
                                className="bg-brand-50 text-brand-700 border-brand-200 text-xs shrink-0">
                                {dict.Participating}
                            </Badge>
                        )}
                    </div>

                    {/* Campaign Title */}
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {campaign.name}
                    </h3>

                    {/* Campaign Details - Compact Grid */}
                    <div className="space-y-2.5 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                                {campaign.organization!.name}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                                {campaign.location}
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">
                                {format(campaign.startTime, 'dd/MM/yy')} -{' '}
                                {format(campaign.endTime, 'dd/MM/yy')}
                            </span>
                        </div>

                        {campaign.organization?.phone && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span className="truncate">
                                    {campaign.organization.phone}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description - Compact */}
                    {campaign.description && (
                        <p className="text-sm text-gray-600 mt-4">
                            {campaign.description}
                        </p>
                    )}
                </CardContent>

                {!passed && (
                    <CardFooter className="p-4 pt-0">
                        <Button
                            variant={isParticipating ? 'outline' : 'default'}
                            size="sm"
                            className={cn(
                                'w-full font-medium transition-all',
                                !isParticipating &&
                                    'bg-brand-600 hover:bg-brand-700 text-white shadow-sm',
                            )}
                            onClick={handleParticipate}
                            disabled={isParticipating || isLoading}>
                            {isParticipating
                                ? dict.Participating
                                : dict.Participate}
                        </Button>
                    </CardFooter>
                )}
            </Card>

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {dict.Confirm_Participation}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {dict.confirming_description}"{campaign.name}"?{' '}
                            {dict.confirming_description_2} {campaign.location}{' '}
                            {dict.from}{' '}
                            {format(campaign.startTime, 'dd-MM-yyyy')} {dict.to}{' '}
                            {format(campaign.endTime, 'dd-MM-yyyy')}.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmParticipation}
                            disabled={isLoading}>
                            {isLoading ? dict.Confirming : dict.Confirm}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
