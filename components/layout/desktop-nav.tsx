'use client';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Loader2, LogOut, User, LogIn, Languages } from 'lucide-react';
import Link from 'next/link';
import { languages } from '@/config/home';
import { useRouter } from 'next/navigation';
import { useUser } from '@/auth';
import { switchLanguage } from '@/actions/language';
import { useState } from 'react';
import { signOut } from '@/actions/sign-out';
import { Role } from '@/types/enums';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface DesktopNavProps {
    dict: any;
    initialLocale: string;
}

export function DesktopNav({ dict, initialLocale }: DesktopNavProps) {
    const { user } = useUser();
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [isLoading, setIsLoading] = useState(false);
    const isRTL = currentLocale === 'ar';
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
        <nav className="flex items-center space-x-2 lg:space-x-4 rtl:space-x-reverse mx-auto">
            {desktopMenu.map(item => (
                <Button
                    asChild
                    variant="ghost"
                    key={item.name}
                    className={cn(
                        'text-gray-900 hover:text-brand-700 transition-colors duration-200',
                        pathname === item.href && 'bg-brand-50 text-brand-700',
                    )}>
                    <Link href={item.href} className="text-sm font-medium">
                        {item.name}
                    </Link>
                </Button>
            ))}

            <DropdownMenu>
                <DropdownMenuTrigger asChild className="focus-visible:ring-0">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 text-foreground">
                        <Languages className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Switch language</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-40">
                    {languages.map(language => (
                        <DropdownMenuItem
                            key={language.code}
                            onClick={() => handleLanguageSwitch(language.code)}
                            className="flex items-center justify-between hover:bg-brand-50 cursor-pointer">
                            {language.name}
                            {language.code === currentLocale && (
                                <span className="h-2 w-2 rounded-full bg-brand-500" />
                            )}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        asChild
                        className="focus-visible:ring-0">
                        <Button
                            variant="default"
                            size="lg"
                            className="flex items-center justify-items-center space-x-2 rtl:space-x-reverse bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors duration-200">
                            <User className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                {user.name || dict.common.profile}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="hover:bg-brand-50">
                            <Link
                                href={
                                    user.role === Role.PARTICIPANT
                                        ? '/profile'
                                        : '/dashboard'
                                }
                                className="w-full text-gray-700">
                                {dict.common.profile}
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:bg-brand-50">
                            <div
                                className="w-full text-gray-700 flex items-center space-x-2 rtl:space-x-reverse"
                                onClick={e => {
                                    e.preventDefault();
                                    handleLogout();
                                }}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>{dict.common.signingOut}</span>
                                    </>
                                ) : (
                                    <>
                                        <LogOut className="h-4 w-4" />
                                        <span>{dict.common.signOut}</span>
                                    </>
                                )}
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                    <Button
                        variant="default"
                        size="lg"
                        className="bg-brand-600 hover:bg-brand-700 text-white shadow-sm transition-colors duration-200">
                        <Link
                            href="/sign-up"
                            className="flex items-center space-x-2 rtl:space-x-reverse">
                            <User className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                {dict.common.signUp}
                            </span>
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="hover:bg-brand-50 text-gray-700 shadow-sm transition-colors duration-200">
                        <Link
                            href="/sign-in"
                            className="flex items-center space-x-2 rtl:space-x-reverse">
                            <LogIn className="h-5 w-5" />
                            <span className="text-sm font-medium">
                                {dict.common.signIn}
                            </span>
                        </Link>
                    </Button>
                </>
            )}
        </nav>
    );
}
