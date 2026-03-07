'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { getUnsubscribeFeedbackList } from '@/actions/unsubscribe';
import { PaginationControls } from '@/components/custom/pagination-controls';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface FeedbackItem {
    id: string;
    email: string;
    userId: string | null;
    type: string;
    reason: string | null;
    createdAt: string;
}

interface UnsubscribeFeedbackClientProps {
    currentPage: number;
    currentType: string;
}

const PAGE_SIZE = 10;
const TYPE_OPTIONS = [
    { value: 'all', label: 'All' },
    { value: 'CAMPAIGN_DIGEST', label: 'Campaign digest' },
    { value: 'BLOOD_REQUEST', label: 'Blood request' },
] as const;

export default function UnsubscribeFeedbackClient({
    currentPage,
    currentType,
}: UnsubscribeFeedbackClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [items, setItems] = useState<FeedbackItem[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const totalPages = Math.ceil(totalCount / PAGE_SIZE);

    const createQueryString = (params: Record<string, string>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            if (!value || value === 'all') {
                newParams.delete(key);
            } else {
                newParams.set(key, value);
            }
        });
        return newParams.toString();
    };

    const handleTypeChange = (value: string) => {
        router.push(
            `${pathname}?${createQueryString({ type: value, page: '1' })}`,
        );
    };

    const handlePageChange = (page: number) => {
        router.push(
            `${pathname}?${createQueryString({ page: page.toString() })}`,
        );
    };

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        getUnsubscribeFeedbackList(
            currentPage,
            PAGE_SIZE,
            currentType === 'all' ? undefined : (currentType as 'CAMPAIGN_DIGEST' | 'BLOOD_REQUEST'),
        )
            .then(result => {
                if (cancelled) return;
                if (result.error) {
                    toast({
                        title: 'Error',
                        description: result.error,
                        variant: 'destructive',
                    });
                    return;
                }
                setItems((result.items ?? []) as FeedbackItem[]);
                setTotalCount(result.totalCount ?? 0);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => { cancelled = true; };
    }, [currentPage, currentType, toast]);

    const typeLabel = (type: string) =>
        type === 'CAMPAIGN_DIGEST' ? 'Campaign digest' : 'Blood request';

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <CardTitle>Unsubscribe feedback</CardTitle>
                        <CardDescription>
                            {totalCount} feedback {totalCount === 1 ? 'entry' : 'entries'} found
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <Label htmlFor="type-filter" className="text-sm whitespace-nowrap">
                            Type
                        </Label>
                        <Select
                            value={currentType}
                            onValueChange={handleTypeChange}
                        >
                            <SelectTrigger id="type-filter" className="w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TYPE_OPTIONS.map(opt => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-md">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    )}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="text-center text-muted-foreground py-8"
                                    >
                                        No feedback yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                items.map(item => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.email}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {typeLabel(item.type)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs truncate text-muted-foreground">
                                            {item.reason || '—'}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {format(
                                                new Date(item.createdAt),
                                                'dd MMM yyyy, HH:mm',
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                {totalPages > 1 && (
                    <div className="mt-4 flex justify-center">
                        <PaginationControls
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
