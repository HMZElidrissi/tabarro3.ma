'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

const FieldGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col gap-4', className)}
        {...props}
    />
));
FieldGroup.displayName = 'FieldGroup';

const Field = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
));
Field.displayName = 'Field';

const FieldLabel = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className,
        )}
        {...props}
    />
));
FieldLabel.displayName = 'FieldLabel';

export { Field, FieldGroup, FieldLabel };
