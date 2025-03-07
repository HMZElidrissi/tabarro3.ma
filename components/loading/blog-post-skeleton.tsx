import { Skeleton } from '@/components/ui/skeleton';

export function BlogPostSkeleton() {
    return (
        <>
            {/* Hero Banner Skeleton */}
            <div className="relative h-[50vh] min-h-[400px] bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>
                <div className="container mx-auto px-4 h-full flex items-end">
                    <div className="relative pb-12 text-white w-full">
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-12 w-full max-w-2xl mb-4" />
                        <div className="flex items-center">
                            <Skeleton className="h-5 w-5 mr-2" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-5 mx-4" />
                            <Skeleton className="h-5 w-5 mr-2" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content skeleton */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 md:p-10 mb-4">
                        <div className="space-y-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Skeleton key={i} className="h-6 w-full" />
                            ))}
                            <div className="py-4">
                                <Skeleton className="h-40 w-full" />
                            </div>
                            {Array.from({ length: 15 }).map((_, i) => (
                                <Skeleton key={i + 12} className="h-6 w-full" />
                            ))}
                        </div>

                        {/* Article footer skeleton */}
                        <div className="mt-12 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2 mb-6">
                                <Skeleton className="h-8 w-16" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </div>

                    {/* Sidebar skeleton */}
                    <aside className="space-y-4">
                        <div className="pt-6">
                            <Skeleton className="h-6 w-32" />
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="flex items-center">
                                <Skeleton className="w-12 h-12 rounded-full mr-2" />
                                <Skeleton className="h-6 w-32" />
                            </div>
                        </div>

                        <div className="rounded-xl shadow-md p-6 bg-gradient-to-br from-gray-200 to-gray-300">
                            <Skeleton className="h-6 w-40 mb-3" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-4" />
                            <Skeleton className="h-10 w-32" />
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <Skeleton className="h-6 w-40 mb-4" />
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div key={i} className="flex gap-3">
                                        <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
                                        <div className="flex-1">
                                            <Skeleton className="h-5 w-full mb-2" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </>
    );
}
