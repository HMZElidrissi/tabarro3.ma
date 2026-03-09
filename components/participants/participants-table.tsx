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
import { Loader2, Mail, MoreHorizontal } from 'lucide-react';
import { User } from '@/types/user';
import { getBloodGroupLabel } from '@/config/blood-group';

interface ParticipantsTableProps {
    participants: User[];
    onDeleteParticipant: (id: string) => void;
    onEditParticipant: (id: string) => void;
    isLoading?: boolean;
    isDeleting?: boolean;
}

export function ParticipantsTable({
    participants,
    onDeleteParticipant,
    onEditParticipant,
    isLoading = false,
    isDeleting = false,
}: ParticipantsTableProps) {
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
                        <TableHead>Email</TableHead>
                        <TableHead>Blood Group</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {participants.map(participant => (
                        <TableRow key={participant.id}>
                            <TableCell className="font-medium">
                                {participant.name}
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col gap-1.5">
                                    <span>{participant.email}</span>
                                    {participant.emailVerifiedAt == null && (
                                        <Badge
                                            variant="outline"
                                            className="w-fit gap-1 rounded-full border-diesel-200 bg-diesel-50 px-2 py-0.5 text-xs font-medium text-diesel-800 dark:border-diesel-800 dark:bg-diesel-950/50 dark:text-diesel-300"
                                        >
                                            <Mail className="h-3 w-3 shrink-0" />
                                            Unverified email
                                        </Badge>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary">
                                    {getBloodGroupLabel(participant.bloodGroup)}
                                </Badge>
                            </TableCell>
                            <TableCell>{participant.phone || '—'}</TableCell>
                            <TableCell>
                                {participant.city?.name || '—'}
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(participant.createdAt),
                                    'MMM d, yyyy',
                                )}
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
                                                onEditParticipant(
                                                    participant.id,
                                                )
                                            }
                                        >
                                            Edit details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive hover:text-destructive-dark"
                                            onClick={() =>
                                                onDeleteParticipant(
                                                    participant.id,
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
                                                'Delete participant'
                                            )}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
