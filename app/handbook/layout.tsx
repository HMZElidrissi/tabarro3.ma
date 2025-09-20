import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { ThemeProvider } from 'next-themes';
import { ModeToggle } from '@/components/custom/mode-toggle';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function HandbookLayout({ children }: LayoutProps) {

    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="theme">
            <div className="min-h-screen bg-background" dir="ltr">
                {/* Simple Header with Logo Only */}
                <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center space-x-2">
                                <Image
                                    src="/logo.svg"
                                    alt="tabarro3"
                                    width={200}
                                    height={200}
                                    className="h-12 w-auto"
                                />
                            </Link>

                            {/* Theme Toggle Only */}
                            <div className="flex items-center">
                                <ModeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">{children}</main>

                {/* Simple Footer */}
                <footer className="border-t border-border bg-muted/50 mt-16">
                    <div className="container mx-auto px-4 py-8">
                        <div className="text-center text-sm text-muted-foreground">
                            <p>
                                &copy; {new Date().getFullYear()} tabarro3.ma
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}
