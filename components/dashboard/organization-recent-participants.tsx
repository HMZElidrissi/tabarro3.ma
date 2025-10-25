'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getBloodGroupLabel } from '@/config/blood-group';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplets } from 'lucide-react';
import { BloodGroup } from '@/types/enums';

const bloodGroupColors: Record<BloodGroup, string> = {
    A_POSITIVE: 'text-red-500',
    A_NEGATIVE: 'text-red-700',
    B_POSITIVE: 'text-blue-500',
    B_NEGATIVE: 'text-blue-700',
    O_POSITIVE: 'text-green-500',
    O_NEGATIVE: 'text-green-700',
    AB_POSITIVE: 'text-purple-500',
    AB_NEGATIVE: 'text-purple-700',
    UNKNOWN: 'text-gray-500',
};

const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

interface ParticipantData {
    id: number;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        bloodGroup: BloodGroup | null;
        city: {
            name: string;
        } | null;
    };
    campaign: {
        id: number;
        name: string;
        location: string;
        startTime: Date;
    };
}

interface OrganizationRecentParticipantsProps {
    participants: ParticipantData[];
}

export function OrganizationRecentParticipants({
    participants,
}: OrganizationRecentParticipantsProps) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Recent Campaign Participants</CardTitle>
                        <CardDescription>
                            Latest participants in your campaigns
                        </CardDescription>
                    </div>
                    <Link href="/dashboard/campaign-participants">
                        <Button variant="ghost" size="sm">
                            View all
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-6 w-full">
                    {participants.slice(0, 5).map(participant => (
                        <div key={participant.id} className="flex items-center">
                            <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                    {getInitials(participant.user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1 flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium leading-none">
                                            {participant.user.name ||
                                                'Anonymous'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {format(
                                                new Date(participant.createdAt),
                                                'MMM d, yyyy',
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="text-xs text-muted-foreground">
                                        {participant.campaign.name}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="text-xs">
                                        {participant.campaign.location}
                                    </Badge>
                                </div>
                            </div>
                            <div className="ml-auto flex items-center">
                                {participant.user.bloodGroup && (
                                    <div
                                        className={`flex items-center font-medium ${bloodGroupColors[participant.user.bloodGroup]}`}>
                                        <Droplets className="h-4 w-4 mr-1" />
                                        {getBloodGroupLabel(
                                            participant.user.bloodGroup,
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {participants.length === 0 && (
                        <div className="text-center text-sm text-muted-foreground py-4">
                            No recent participants
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
