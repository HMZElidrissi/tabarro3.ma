'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/user';
import { format } from 'date-fns';
import { BloodGroup } from '@/types/enums';
import { Droplets } from 'lucide-react';
import { getBloodGroupLabel } from '@/config/blood-group';

interface RecentParticipantsProps {
    participants: User[];
}

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

export function RecentParticipants({ participants }: RecentParticipantsProps) {
    return (
        <div className="space-y-8 w-full">
            {participants.map(participant => (
                <div key={participant.id} className="flex items-center">
                    <Avatar className="h-9 w-9">
                        <AvatarFallback>
                            {getInitials(participant.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            {participant.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Joined{' '}
                            {format(
                                new Date(participant.createdAt),
                                'MMM d, yyyy',
                            )}
                        </p>
                    </div>
                    <div className="ml-auto flex items-center">
                        {participant.bloodGroup && (
                            <div
                                className={`flex items-center font-medium ${bloodGroupColors[participant.bloodGroup]}`}
                            >
                                <Droplets className="h-4 w-4 mr-1" />
                                {getBloodGroupLabel(participant.bloodGroup)}
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
    );
}
