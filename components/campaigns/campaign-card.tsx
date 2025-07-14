'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Phone, User } from 'lucide-react';
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

    return (
        <>
            <Card className="h-full flex flex-col shadow-md hover:shadow-lg">
                <CardContent className="flex-1 pt-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Badge
                                variant={isOngoing ? 'default' : 'secondary'}
                                className={cn(
                                    isOngoing
                                        ? 'bg-brand-100 text-brand-800'
                                        : '',
                                    isUpcoming
                                        ? 'bg-blue-100 text-blue-800'
                                        : '',
                                    isPast ? 'bg-gray-100 text-gray-800' : '',
                                )}
                            >
                                {cn(
                                    isOngoing
                                        ? dict.Ongoing
                                        : isUpcoming
                                          ? dict.Upcoming
                                          : dict.Past,
                                )}
                            </Badge>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-lg font-semibold">
                                {campaign.name}
                            </h3>

                            <div className="flex items-center gap-2 text-sm text-gray-800">
                                <User className="h-4 w-4" />
                                {campaign.organization!.name}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-800">
                                <MapPin className="h-4 w-4" />
                                {campaign.location}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-gray-800">
                                <Calendar className="h-4 w-4" />
                                {format(
                                    campaign.startTime,
                                    'dd/MM/yyyy',
                                )} - {format(campaign.endTime, 'dd/MM/yyyy')}
                            </div>

                            {campaign.organization?.phone && (
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                    <Phone className="h-4 w-4" />
                                    {campaign.organization.phone}
                                </div>
                            )}

                            {campaign.description && (
                                <p className="text-sm mt-2 text-gray-900">
                                    {campaign.description}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-6">
                    {!passed && (
                        <Button
                            variant={isParticipating ? 'outline' : 'brand'}
                            className="w-full"
                            onClick={handleParticipate}
                            disabled={isParticipating || isLoading}
                        >
                            {isParticipating
                                ? dict.Participating
                                : dict.Participate}
                        </Button>
                    )}
                </CardFooter>
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
                            disabled={isLoading}
                        >
                            {isLoading ? dict.Confirming : dict.Confirm}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
