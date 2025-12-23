import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { ThemeProvider } from 'next-themes';
import { ModeToggle } from '@/components/custom/mode-toggle';
import { getDictionary } from '@/i18n/get-dictionary';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function ParticipateLayout({ children }: LayoutProps) {
    const dict = await getDictionary();
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="theme"
        >
            <div>
                <div className="text-foreground antialiased">
                    {/* Dark mode toggle */}
                    <div className="absolute top-4 right-4 z-50">
                        <ModeToggle dict={dict.theme} />
                    </div>
                    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-4 sm:pt-0 bg-background">
                        {/* <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="tabarro3"
                                width={100}
                                height={100}
                                className="my-2"
                            />
                        </Link> */}

                        <div className="w-full sm:max-w-md mt-1 px-6 py-4 bg-card shadow-md overflow-hidden sm:rounded-lg border my-4">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
}
