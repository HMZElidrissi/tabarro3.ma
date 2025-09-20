'use client';

import { switchLanguage } from '@/actions/language';
import { signOut } from '@/actions/sign-out';
import { useUser } from '@/auth';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages } from '@/config/home';
import { cn } from '@/lib/utils';
import { Role } from '@/types/enums';
import { ChevronDown, Globe, Loader2, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { ProgressLink as Link } from '@/components/custom/progress-link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ModeToggle } from '@/components/custom/mode-toggle';

interface DesktopNavProps {
    dict: any;
    initialLocale: string;
}

export function DesktopNav({ dict, initialLocale }: DesktopNavProps) {
    const { user } = useUser();
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [isLoading, setIsLoading] = useState(false);
    const pathname = usePathname();

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await signOut();
            router.push('/sign-in');
        } catch (error) {
            console.error('Error signing out:', error);
            setIsLoading(false);
        }
    };

    const handleLanguageSwitch = async (newLocale: string) => {
        await switchLanguage(newLocale);
        setCurrentLocale(newLocale);
        router.refresh();
    };

    const currentLanguage = languages.find(lang => lang.code === currentLocale);

    const desktopMenu = [
        {
            name: dict.menu.home,
            href: '/',
        },
        {
            name: dict.menu.bloodRequests,
            href: '/requests',
        },
        {
            name: dict.menu.newCampaigns,
            href: '/campaigns',
        },
        {
            name: dict.menu.blog,
            href: '/blog',
        },
        {
            name: dict.menu.about,
            href: '/about',
        },
        {
            name: dict.menu.eligibility,
            href: '/eligibility',
        },
        {
            name: dict.menu.donationCenters,
            href: '/#map',
        },
        {
            name: dict.menu.whyDonateBlood,
            href: '/#benefits',
        },
        {
            name: dict.menu.whoCanDonateBlood,
            href: '/#criterias',
        },
    ];

    return (
        <nav className="relative flex items-center justify-between w-full max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Left Section - Navigation Items */}
            <div className="flex items-center space-x-1 lg:space-x-2 rtl:space-x-reverse">
                {desktopMenu.slice(0, 4).map(item => (
                    <Button
                        asChild
                        variant="ghost"
                        key={item.name}
                        className={cn(
                            'text-foreground hover:text-brand-700 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/50 transition-colors duration-200 px-3 py-2 text-sm font-medium',
                            pathname === item.href &&
                                'bg-brand-50 dark:bg-brand-900/50 text-brand-700 dark:text-brand-400',
                        )}>
                        <Link href={item.href}>{item.name}</Link>
                    </Button>
                ))}

                {/* Additional menu items in dropdown for better space management */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="text-foreground hover:text-brand-700 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/50 transition-colors duration-200 px-3 py-2 text-sm font-medium focus-visible:ring-0">
                            {dict.menu.more}
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        {/* / */}
                        {desktopMenu.slice(4).map(item => (
                            <DropdownMenuItem
                                key={item.name}
                                className="hover:bg-brand-50 dark:hover:bg-brand-900/50">
                                <Link
                                    href={item.href}
                                    className="w-full text-foreground">
                                    {item.name}
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Center Section - Logo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo-header.svg"
                        alt="tabarro3"
                        width={500}
                        height={500}
                        className="h-auto w-12"
                        priority
                    />
                </Link>
            </div>

            {/* Right Section - Language Switcher and User Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3 rtl:space-x-reverse">
                {/* Dark Mode Toggle */}
                <ModeToggle dict={dict.theme} />

                {/* Language Switcher */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted/50 transition-colors duration-200 focus-visible:ring-0">
                            <Globe className="h-4 w-4 flex-shrink-0" />
                            <span className="font-medium leading-none">
                                {currentLanguage?.name}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        {languages.map(language => (
                            <DropdownMenuItem
                                key={language.code}
                                onClick={() =>
                                    handleLanguageSwitch(language.code)
                                }
                                className="flex items-center justify-between hover:bg-brand-50 dark:hover:bg-brand-900/50 cursor-pointer">
                                {language.name}
                                {language.code === currentLocale && (
                                    <span className="h-2 w-2 rounded-full bg-brand-500" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* User Authentication Section */}
                {user ? (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="brand"
                                    size="sm"
                                    className="flex items-center gap-x-2 transition-colors duration-200 px-3 py-2 focus-visible:ring-0">
                                    <User className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm font-medium hidden sm:inline leading-none">
                                        {user.name || dict.common.profile}
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="hover:bg-brand-50 dark:hover:bg-brand-900/50">
                                    <Link
                                        href={
                                            user.role === Role.PARTICIPANT
                                                ? '/profile'
                                                : '/dashboard'
                                        }
                                        className="w-full text-brand-700 dark:text-brand-400 flex items-center gap-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{dict.common.profile}</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="hover:bg-brand-50 dark:hover:bg-brand-900/50">
                                    <div
                                        className="w-full text-gray-700 dark:text-foreground flex items-center gap-x-2 cursor-pointer"
                                        onClick={e => {
                                            e.preventDefault();
                                            handleLogout();
                                        }}>
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>
                                                    {dict.common.signingOut}
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="h-4 w-4" />
                                                <span>
                                                    {dict.common.signOut}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-muted/50 transition-colors duration-200 px-3 py-2 text-sm font-medium">
                            <Link
                                href="/sign-in"
                                className="flex items-center space-x-1 rtl:space-x-reverse underline font-bold">
                                <span>{dict.common.signIn}</span>
                            </Link>
                        </Button>

                        <Button
                            asChild
                            variant="brand"
                            size="sm"
                            className="transition-colors duration-200 rounded-md px-4 py-2 text-sm font-medium focus-visible:ring-0">
                            <Link
                                href="/sign-up"
                                className="flex items-center space-x-1 rtl:space-x-reverse">
                                <span>{dict.common.signUp}</span>
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </nav>
    );
}
