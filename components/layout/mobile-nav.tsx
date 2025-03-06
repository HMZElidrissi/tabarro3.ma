'use client';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Loader2, LogOut, Menu } from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/auth';
import { useState } from 'react';
import { signOut } from '@/actions/sign-out';
import { Role } from '@/types/enums';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { languages } from '@/config/home';
import { switchLanguage } from '@/actions/language';
import { cn } from '@/lib/utils';

interface MobileNavProps {
    dict: any;
    initialLocale: string;
    languages: Array<{ code: string; name: string }>;
    onLanguageSwitch: (locale: string) => Promise<void>;
}

export function MobileNav({ dict, initialLocale }: MobileNavProps) {
    const { user } = useUser();
    const router = useRouter();
    const [currentLocale, setCurrentLocale] = useState(initialLocale);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
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

    const mobileMenu = [
        { name: dict.menu.home, href: '/' },
        { name: dict.menu.bloodRequests, href: '/requests' },
        { name: dict.menu.newCampaigns, href: '/campaigns' },
        { name: dict.menu.blog, href: '/blog' },
        { name: dict.menu.donationCenters, href: '/#map' },
        { name: dict.menu.whyDonateBlood, href: '/#benefits' },
        { name: dict.menu.whoCanDonateBlood, href: '/#criterias' },
    ];

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">{dict.common.openMenu}</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
                <VisuallyHidden>
                    <SheetTitle>Mobile Navigation</SheetTitle>
                </VisuallyHidden>

                <nav className="flex flex-col space-y-4">
                    {mobileMenu.map(item => (
                        <Button
                            key={item.name}
                            asChild
                            variant="ghost"
                            className={cn(
                                'w-full justify-start',
                                pathname === item.href && 'text-brand-600',
                            )}
                            onClick={() => setIsOpen(false)}>
                            <Link href={item.href}>{item.name}</Link>
                        </Button>
                    ))}

                    <Accordion type="single" collapsible>
                        <AccordionItem value="languages">
                            <AccordionTrigger>
                                {dict.common.selectLanguage}
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col space-y-2">
                                    {languages.map(language => (
                                        <Button
                                            key={language.code}
                                            variant="ghost"
                                            className="justify-start"
                                            onClick={() => {
                                                handleLanguageSwitch(
                                                    language.code,
                                                );
                                                setIsOpen(false);
                                            }}>
                                            {language.name}
                                            {language.code ===
                                                currentLocale && (
                                                <span className="ml-2 h-2 w-2 rounded-full bg-brand-500" />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <div className="border-t pt-4">
                        {user ? (
                            <>
                                <Button
                                    variant="default"
                                    className="w-full bg-brand-600 text-white hover:bg-brand-700"
                                    onClick={() => setIsOpen(false)}>
                                    <Link
                                        href={
                                            user.role === Role.PARTICIPANT
                                                ? '/profile'
                                                : '/dashboard'
                                        }>
                                        {user.name || dict.common.profile}
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full"
                                    onClick={handleLogout}
                                    disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            <span>
                                                {dict.common.signingOut}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>{dict.common.signOut}</span>
                                        </>
                                    )}
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="default"
                                    className="w-full bg-brand-600 text-white hover:bg-brand-700"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/sign-in');
                                    }}>
                                    {dict.common.signIn}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="mt-2 w-full"
                                    onClick={() => {
                                        setIsOpen(false);
                                        router.push('/sign-up');
                                    }}>
                                    {dict.common.signUp}
                                </Button>
                            </>
                        )}
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    );
}
