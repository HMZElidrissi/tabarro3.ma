import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { useSearchParams } from 'next/navigation';

interface PaginationInfo {
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function PaginationControls({
    totalPages,
    onPageChange,
}: PaginationInfo) {
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const generatePaginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(
            1,
            currentPage - Math.floor(maxVisiblePages / 2),
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust start if we're near the end
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // First page
        if (startPage > 1) {
            items.push(
                <PaginationItem key="1">
                    <PaginationLink
                        onClick={() => onPageChange(1)}
                        className={
                            currentPage === 1
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:bg-accent hover:text-accent-foreground'
                        }
                    >
                        1
                    </PaginationLink>
                </PaginationItem>,
            );
            if (startPage > 2) {
                items.push(
                    <PaginationItem key="start-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }
        }

        // Page numbers
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        onClick={() => onPageChange(i)}
                        className={
                            currentPage === i
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:bg-accent hover:text-accent-foreground'
                        }
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        // Last page
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                items.push(
                    <PaginationItem key="end-ellipsis">
                        <PaginationEllipsis />
                    </PaginationItem>,
                );
            }
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        onClick={() => onPageChange(totalPages)}
                        className={
                            currentPage === totalPages
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                : 'hover:bg-accent hover:text-accent-foreground'
                        }
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        return items;
    };

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(currentPage - 1)}
                        className={
                            currentPage <= 1
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
                        }
                    />
                </PaginationItem>

                {generatePaginationItems()}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(currentPage + 1)}
                        className={
                            currentPage >= totalPages
                                ? 'pointer-events-none opacity-50'
                                : 'cursor-pointer hover:bg-accent hover:text-accent-foreground'
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
