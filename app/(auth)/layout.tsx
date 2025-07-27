import Link from 'next/link';
import AuthCard from '@/components/auth/auth-card';
import React from 'react';
import Image from 'next/image';
import { ThemeProvider } from 'next-themes';
import { ModeToggle } from '@/components/custom/mode-toggle';
import { getDictionary } from '@/i18n/get-dictionary';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const dict = await getDictionary();
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            storageKey="theme">
            <div>
                <div className="text-foreground antialiased">
                    {/* Dark mode toggle */}
                    <div className="absolute top-4 right-4 z-50">
                        <ModeToggle dict={dict.theme} />
                    </div>

                    <AuthCard
                        logo={
                            <Link href="/">
                                <Image
                                    src="/logo-header.svg"
                                    alt="tabarro3"
                                    width={200}
                                    height={200}
                                    className="my-5"
                                />
                            </Link>
                        }>
                        {children}
                    </AuthCard>
                </div>
            </div>
        </ThemeProvider>
    );
};
