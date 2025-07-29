import type React from 'react';
import { cn } from '@/lib/utils';

interface MarqueeProps {
    className?: string;
    reverse?: boolean;
    pauseOnHover?: boolean;
    children?: React.ReactNode;
    vertical?: boolean;
    repeat?: number;
    [key: string]: any;
}

export default function Marquee({
    className,
    reverse,
    pauseOnHover = false,
    children,
    vertical = false,
    repeat = 4,
    ...props
}: MarqueeProps) {
    return (
        <div
            {...props}
            className={cn(
                'group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]',
                {
                    'flex-row items-start': !vertical, // Changed from default alignment
                    'flex-col': vertical,
                },
                className,
            )}>
            {Array(repeat)
                .fill(0)
                .map((_, i) => (
                    <div
                        key={i}
                        className={cn(
                            'flex shrink-0 justify-around [gap:var(--gap)]',
                            {
                                'animate-marquee flex-row items-start':
                                    !vertical,
                                'animate-marquee-vertical flex-col': vertical,
                                'group-hover:[animation-play-state:paused]':
                                    pauseOnHover,
                                '[animation-direction:reverse]': reverse,
                            },
                        )}>
                        {children}
                    </div>
                ))}
        </div>
    );
}
