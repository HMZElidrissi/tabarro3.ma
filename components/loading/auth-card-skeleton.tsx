import { shimmer } from '@/components/loading/shimmer';

export function AuthCardSkeleton() {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-background">
            {/* Logo skeleton */}
            <div className="relative w-12 h-12 bg-muted rounded-lg overflow-hidden">
                <div className={`absolute inset-0 ${shimmer}`} />
            </div>

            {/* Card skeleton */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-card shadow-md overflow-hidden sm:rounded-lg border">
                {/* Form fields skeletons */}
                <div className="space-y-6">
                    {/* Title skeleton */}
                    <div className="relative h-8 bg-muted rounded w-3/4 overflow-hidden">
                        <div className={`absolute inset-0 ${shimmer}`} />
                    </div>

                    {/* Input field skeletons */}
                    {[1, 2].map(index => (
                        <div key={index} className="space-y-2">
                            <div className="relative h-4 bg-muted rounded w-1/4 overflow-hidden">
                                <div
                                    className={`absolute inset-0 ${shimmer}`}
                                />
                            </div>
                            <div className="relative h-10 bg-muted rounded w-full overflow-hidden">
                                <div
                                    className={`absolute inset-0 ${shimmer}`}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Button skeleton */}
                    <div className="relative h-10 bg-muted rounded w-full overflow-hidden">
                        <div className={`absolute inset-0 ${shimmer}`} />
                    </div>

                    {/* Links skeleton */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="relative h-4 bg-muted rounded w-1/3 overflow-hidden">
                            <div className={`absolute inset-0 ${shimmer}`} />
                        </div>
                        <div className="relative h-4 bg-muted rounded w-1/3 overflow-hidden">
                            <div className={`absolute inset-0 ${shimmer}`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
