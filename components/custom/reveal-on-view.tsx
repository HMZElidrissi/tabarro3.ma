'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface RevealOnViewProps {
    children: React.ReactNode;
    className?: string;
    /** Delay before playing animation (ms) */
    delay?: number;
    /** Root margin for IntersectionObserver (e.g. "0px 0px -80px 0px" to trigger 80px before in view) */
    rootMargin?: string;
}

/**
 * Wraps content and runs a fade-in-up animation when the element enters the viewport.
 * Uses IntersectionObserver; no animation runs until the element is in view (or near it).
 */
export function RevealOnView({
    children,
    className,
    delay = 0,
    rootMargin = '0px 0px -40px 0px',
}: RevealOnViewProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    const t = setTimeout(() => setVisible(true), delay);
                    return () => clearTimeout(t);
                }
            },
            { threshold: 0.1, rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [delay, rootMargin]);

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-500',
                visible
                    ? 'animate-fade-in-up opacity-100'
                    : 'opacity-0 translate-y-4',
                className
            )}
        >
            {children}
        </div>
    );
}
