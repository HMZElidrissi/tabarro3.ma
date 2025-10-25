import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getBloodGroupLabel } from '@/config/blood-group';
import { format } from 'date-fns';
import { BloodGroup, Role } from '@/types/enums';
import { Loader2 } from 'lucide-react';

interface ParticipantWithCampaign {
    id: number;
    createdAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        phone: string | null;
        bloodGroup: BloodGroup | null;
        city: {
            id: number;
            name: string;
            regionId: number;
        } | null;
    };
    campaign: {
        id: number;
        name: string;
        location: string;
        startTime: Date;
        organization: {
            name: string | null;
        };
    };
}

interface LatestCampaignParticipantsProps {
    participants: ParticipantWithCampaign[];
    userRole: Role;
    isLoading?: boolean;
}

export function LatestCampaignParticipants({
    participants,
    userRole,
    isLoading = false,
}: LatestCampaignParticipantsProps) {
    const showOrganizationColumn = userRole === Role.ADMIN;

    return (
        <div className="relative">
            {isLoading && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Participant</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Campaign</TableHead>
                        {showOrganizationColumn && (
                            <TableHead>Organization</TableHead>
                        )}
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {participants.map(participant => (
                        <TableRow key={participant.id}>
                            <TableCell className="font-medium">
                                {participant.user.name || 'N/A'}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col text-sm">
                                    <span className="text-muted-foreground">
                                        {participant.user.email}
                                    </span>
                                    {participant.user.phone && (
                                        <span className="text-muted-foreground">
                                            {participant.user.phone}
                                        </span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                    {participant.user.bloodGroup
                                        ? getBloodGroupLabel(
                                              participant.user.bloodGroup,
                                          ) || 'Unknown'
                                        : 'N/A'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-medium">
                                        {participant.campaign.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {participant.user.city?.name}
                                    </span>
                                </div>
                            </TableCell>
                            {showOrganizationColumn && (
                                <TableCell className="text-muted-foreground">
                                    {participant.campaign.organization.name ||
                                        'N/A'}
                                </TableCell>
                            )}
                            <TableCell className="text-muted-foreground">
                                {participant.campaign.location}
                            </TableCell>
                            <TableCell className="text-right">
                                {format(
                                    new Date(participant.createdAt),
                                    'dd-MM-yyyy',
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                    {participants.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={showOrganizationColumn ? 7 : 6}
                                className="text-center py-8 text-muted-foreground">
                                No campaign participants yet
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
