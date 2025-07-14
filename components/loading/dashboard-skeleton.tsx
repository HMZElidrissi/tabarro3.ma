import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            {/* Stats Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-[120px] p-6 bg-card/50">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>
                    </Skeleton>
                ))}
            </div>

            {/* Chart and Recent Data Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Chart Card Skeleton */}
                <Skeleton className="md:col-span-1 lg:col-span-4 h-[400px]">
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-4 w-60" />
                        <Skeleton className="h-[300px] w-full mt-4" />
                    </div>
                </Skeleton>

                {/* Recent Activity Card Skeleton */}
                <Skeleton className="md:col-span-1 lg:col-span-3 h-[400px]">
                    <div className="p-6 space-y-4">
                        <Skeleton className="h-7 w-40" />
                        <Skeleton className="h-4 w-60" />
                        <div className="space-y-3 mt-4">
                            {[...Array(5)].map((_, i) => (
                                <div
                                    key={i}
                                    className="flex items-center space-x-4"
                                >
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-30" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Skeleton>
            </div>
        </div>
    );
}
