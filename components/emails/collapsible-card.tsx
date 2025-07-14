import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
    title: string;
    icon: React.ReactNode;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    badge?: React.ReactNode;
    variant?:
        | 'blue'
        | 'purple'
        | 'green'
        | 'orange'
        | 'indigo'
        | 'red'
        | 'default';
}

export default function CollapsibleCard({
    title,
    icon,
    isOpen,
    onToggle,
    children,
    badge,
    variant = 'default',
}: CollapsibleCardProps) {
    const variants = {
        default: '',
        blue: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900',
        purple: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-100 dark:border-purple-900',
        green: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-emerald-100 dark:border-emerald-900',
        orange: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-100 dark:border-amber-900',
        indigo: 'bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/50 border-indigo-100 dark:border-indigo-900',
        red: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/50 dark:to-rose-950/50 border-red-100 dark:border-red-900',
    };

    return (
        <Collapsible open={isOpen} onOpenChange={onToggle}>
            <Card className={cn('transition-all', variants[variant])}>
                <CollapsibleTrigger asChild>
                    <CardHeader
                        className={cn(
                            'cursor-pointer transition-colors',
                            variant === 'default'
                                ? 'hover:bg-accent'
                                : 'hover:bg-white/20 dark:hover:bg-black/10',
                        )}
                    >
                        <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                            <div className="flex items-center gap-2">
                                {icon}
                                {title}
                                {badge}
                            </div>
                            {isOpen ? (
                                <ChevronUp className="w-4 h-4" />
                            ) : (
                                <ChevronDown className="w-4 h-4" />
                            )}
                        </CardTitle>
                    </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <CardContent className="pt-0">{children}</CardContent>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
}
