'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: ReactNode;
    description?: ReactNode;
    /**
     * Controls the decorative blood drop icon and underline bar.
     */
    showDecoration?: boolean;
    /**
     * Extra content rendered below the header (e.g. filters).
     */
    children?: ReactNode;
    className?: string;
}

export function PageHeader({
    title,
    description,
    showDecoration = true,
    children,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn('text-center mb-10 relative', className)}>
            {showDecoration && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-10">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-brand-600 dark:text-brand-400"
                    >
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                </div>
            )}

            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                {title}
            </h1>

            {description && (
                <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
                    {description}
                </p>
            )}

            {showDecoration && (
                <div className="mt-4 w-16 h-1 bg-brand-500 mx-auto rounded-full" />
            )}

            {children && <div className="mt-8">{children}</div>}
        </div>
    );
}

