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
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { Role } from '@/types/enums';
import { User } from '@/types/user';

interface OrganizationsTableProps {
    organizations: User[];
    onRemoveOrganization: (id: string) => void;
    onUpdateRole: (id: string, role: Role) => void;
    isLoading?: boolean;
}

export function OrganizationsTable({
    organizations,
    onRemoveOrganization,
    onUpdateRole,
    isLoading = false,
}: OrganizationsTableProps) {
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
                        <TableHead>Location</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {organizations.map(organization => (
                        <TableRow key={organization.id}>
                            <TableCell>{organization.name || '—'}</TableCell>
                            <TableCell>{organization.email}</TableCell>
                            <TableCell>
                                {organization.city ? (
                                    <div className="text-sm">
                                        <div>{organization.city.name}</div>
                                        <div className="text-muted-foreground">
                                            {organization.city.region?.name}
                                        </div>
                                    </div>
                                ) : (
                                    '—'
                                )}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        organization.role === 'ADMIN'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {organization.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {format(
                                    new Date(organization.createdAt),
                                    'MMM d, yyyy',
                                )}
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={isLoading}
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onUpdateRole(
                                                    organization.id as string,
                                                    organization.role ===
                                                        Role.ADMIN
                                                        ? Role.ORGANIZATION
                                                        : Role.ADMIN,
                                                )
                                            }
                                        >
                                            Change Role
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                onRemoveOrganization(
                                                    organization.id,
                                                )
                                            }
                                            className="text-red-600"
                                        >
                                            Remove
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                    {organizations.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No organizations or admins found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
