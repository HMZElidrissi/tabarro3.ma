'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Droplets, Heart, Users, X } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface SignupInvitationProps {
    dict: any;
    isRTL: boolean;
}

const SignupInvitation = ({ dict, isRTL }: SignupInvitationProps) => {
    const [showInvitation, setShowInvitation] = useState(false);

    useEffect(() => {
        const hasSeenInvite = localStorage.getItem('signupInvitation');
        if (!hasSeenInvite) {
            setShowInvitation(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('signupInvitation', 'dismissed');
        setShowInvitation(false);
    };

    const handleSignup = () => {
        localStorage.setItem('signupInvitation', 'accepted');
        setShowInvitation(false);
    };

    return (
        <AlertDialog open={showInvitation} onOpenChange={setShowInvitation}>
            <AlertDialogContent
                className="max-w-md p-0 overflow-hidden bg-background"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <VisuallyHidden>
                    <AlertDialogTitle>{dict.title}</AlertDialogTitle>
                </VisuallyHidden>
                {/* Hero Section with Gradient Background */}
                <div className="relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 pb-12">
                    <div className="absolute inset-0 bg-brand-400 opacity-10" />
                    <div className="relative">
                        {/* Close Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute -top-2 ${isRTL ? '-left-2' : '-right-2'} h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white dark:text-foreground`}
                            onClick={handleDismiss}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <Droplets className="h-12 w-12 text-white/90 mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {dict.title}
                        </h2>
                        <p className="text-brand-50 text-sm">{dict.subtitle}</p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="px-6 my-1">
                    <div className="bg-background rounded-lg border shadow-sm p-4 space-y-4">
                        <div className="flex items-center gap-3 p-2 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                            <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                                <Heart className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {dict.features.impact}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {dict.features.connect}
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-2 hover:bg-brand-50/50 dark:hover:bg-brand-900/20 rounded-lg transition-colors">
                            <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center">
                                <Droplets className="h-4 w-4 text-brand-500 dark:text-brand-400" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {dict.features.notify}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-6 pt-4">
                    <div className="flex flex-col gap-3">
                        <Link href="/sign-up" className="w-full">
                            <Button
                                onClick={handleSignup}
                                className="w-full bg-brand-600 hover:bg-brand-700 text-white dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 font-bold h-11"
                            >
                                {dict.cta.create}
                                <ArrowRight
                                    className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4`}
                                />
                            </Button>
                        </Link>

                        <div className="flex items-center gap-2 justify-center">
                            <span className="text-sm text-muted-foreground">
                                {dict.cta.member}
                            </span>
                            <Link
                                href="/sign-in"
                                className="text-sm text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium hover:underline"
                            >
                                {dict.cta.signin}
                            </Link>
                        </div>

                        <AlertDialogCancel
                            onClick={handleDismiss}
                            className="mt-2 text-muted-foreground hover:text-foreground hover:bg-muted/80"
                        >
                            {dict.cta.later}
                        </AlertDialogCancel>
                    </div>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default SignupInvitation;
