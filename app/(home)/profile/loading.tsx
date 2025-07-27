import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ProfileLoading() {
    return (
        <div className="flex flex-col bg-background">
            <div className="flex-1 flex items-center justify-center">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="container py-8 space-y-8">
                        {/* Header */}
                        <div className="space-y-0.5">
                            <Skeleton className="h-8 w-48" />
                            <Skeleton className="h-4 w-72 mt-2" />
                        </div>

                        <Separator />

                        {/* Tabs */}
                        <div className="w-full">
                            <div className="flex space-x-2 mb-6">
                                <Skeleton className="h-10 w-32" />
                                <Skeleton className="h-10 w-32" />
                            </div>

                            {/* Tab Content */}
                            <div className="mt-6">
                                <Card className="p-6">
                                    <div className="space-y-6">
                                        {/* Blood Requests Grid Skeleton */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {Array.from({ length: 6 }).map(
                                                (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="space-y-3">
                                                        <Skeleton className="h-4 w-3/4" />
                                                        <Skeleton className="h-4 w-1/2" />
                                                        <Skeleton className="h-4 w-2/3" />
                                                        <div className="flex gap-2 mt-3">
                                                            <Skeleton className="h-6 w-16" />
                                                            <Skeleton className="h-6 w-20" />
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
