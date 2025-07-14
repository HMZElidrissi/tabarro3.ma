import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, MoreHorizontal } from 'lucide-react';
import { Campaign } from '@/types/campaign';
import { Role } from '@/types/enums';
import { CampaignParticipantsTable } from '@/components/campaigns/campaign-participants-table';

interface CampaignsTableProps {
    campaigns: Campaign[];
    onDeleteCampaign: (id: number) => void;
    onEditCampaign: (id: number) => void;
    userRole: Role;
    isLoading?: boolean;
    isDeleting?: boolean;
}

export function CampaignsTable({
    campaigns,
    onDeleteCampaign,
    onEditCampaign,
    userRole,
    isLoading = false,
    isDeleting = false,
}: CampaignsTableProps) {
    const getCampaignStatus = (startTime: Date, endTime: Date) => {
        const now = new Date();
        if (now < new Date(startTime)) return 'Upcoming';
        if (now > new Date(endTime)) return 'Completed';
        return 'In Progress';
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Upcoming':
                return 'secondary';
            case 'In Progress':
                return 'outline';
            case 'Completed':
                return 'default';
            default:
                return 'secondary';
        }
    };

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
                        <TableHead>Name</TableHead>
                        <TableHead>Organization</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campaigns.map(campaign => {
                        const status = getCampaignStatus(
                            campaign.startTime,
                            campaign.endTime,
                        );
                        return (
                            <TableRow key={campaign.id}>
                                <TableCell className="font-medium">
                                    {campaign.name}
                                </TableCell>
                                <TableCell>
                                    {campaign.organization!.name}
                                </TableCell>
                                <TableCell>
                                    {campaign.city!.name} - {campaign.location}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(campaign.startTime),
                                        'dd-MM-yyyy',
                                    )}
                                </TableCell>
                                <TableCell>
                                    {format(
                                        new Date(campaign.endTime),
                                        'dd-MM-yyyy',
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={getStatusBadgeVariant(status)}
                                    >
                                        {status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <CampaignParticipantsTable
                                        campaign={campaign}
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-8 w-8 p-0"
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    onEditCampaign(campaign.id)
                                                }
                                            >
                                                Edit details
                                            </DropdownMenuItem>
                                            {(userRole === Role.ADMIN ||
                                                status === 'Upcoming') && (
                                                <DropdownMenuItem
                                                    className="text-destructive hover:text-destructive-dark"
                                                    onClick={() =>
                                                        onDeleteCampaign(
                                                            campaign.id,
                                                        )
                                                    }
                                                    disabled={isDeleting}
                                                >
                                                    {isDeleting ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Deleting...
                                                        </>
                                                    ) : (
                                                        'Delete campaign'
                                                    )}
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
