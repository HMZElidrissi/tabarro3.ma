'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const InputGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex h-9 w-full items-center overflow-hidden rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring',
            className,
        )}
        {...props}
    />
));
InputGroup.displayName = 'InputGroup';

const InputGroupInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            'flex-1 bg-transparent px-3 py-1 text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
        )}
        {...props}
    />
));
InputGroupInput.displayName = 'InputGroupInput';

const InputGroupAddon = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'flex h-9 items-center border-l border-input px-3',
            className,
        )}
        {...props}
    />
));
InputGroupAddon.displayName = 'InputGroupAddon';

export { InputGroup, InputGroupAddon, InputGroupInput };
