'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModeToggleProps {
    dict?: {
        label?: string;
        light?: string;
        dark?: string;
        system?: string;
    };
}

export const ModeToggle = ({ dict }: ModeToggleProps) => {
    const { setTheme } = useTheme();

    const themes = [
        { label: dict?.light || 'Light', value: 'light' },
        { label: dict?.dark || 'Dark', value: 'dark' },
        { label: dict?.system || 'System', value: 'system' },
    ];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-foreground"
                    aria-label={dict?.label || 'Theme'}>
                    <SunIcon className="dark:-rotate-90 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:scale-0" />
                    <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">
                        {dict?.label || 'Toggle theme'}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {themes.map(({ label, value }) => (
                    <DropdownMenuItem
                        key={value}
                        onClick={() => setTheme(value)}>
                        {label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
