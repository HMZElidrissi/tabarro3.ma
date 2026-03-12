'use client';

import { User } from '@/types/user';
import { BloodRequest } from '@/types/blood-request';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ProfileSidebar } from '@/components/profile/profile-sidebar';
import { ProfileUrgencyFeed } from '@/components/profile/profile-urgency-feed';
import { ProfileImpactWall } from '@/components/profile/profile-impact-wall';

interface ProfileLayoutProps {
    user: User;
    bloodRequests: BloodRequest[];
    dict: any;
    isRTL?: boolean;
}

export function ProfileLayout({
    user,
    bloodRequests,
    dict,
    isRTL,
}: ProfileLayoutProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div
            dir={isRTL ? 'rtl' : 'ltr'}
            className={cn(
                'py-8 transition-all duration-500 ease-out',
                mounted
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4',
            )}
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr_256px] xl:grid-cols-[300px_1fr_272px] items-start">
                {/* Column 1 – Identity Card / Sidebar */}
                <div
                    className={cn(
                        'section-reveal lg:sticky lg:top-6',
                        // stagger: col 1 first
                        'animate-fade-in-up',
                    )}
                    style={{ animationDelay: '0ms' }}
                >
                    <ProfileSidebar user={user} dict={dict} isRTL={isRTL} />
                </div>

                {/* Column 2 – Urgency Feed */}
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '80ms', opacity: 0 }}
                >
                    <ProfileUrgencyFeed
                        user={user}
                        bloodRequests={bloodRequests}
                        dict={dict}
                        isRTL={isRTL}
                    />
                </div>

                {/* Column 3 – Impact Wall (hidden under lg, shown below feed) */}
                <div
                    className="animate-fade-in-up lg:sticky lg:top-6"
                    style={{ animationDelay: '160ms', opacity: 0 }}
                >
                    <ProfileImpactWall
                        user={user}
                        bloodRequests={bloodRequests}
                        dict={dict}
                        isRTL={isRTL}
                    />
                </div>
            </div>
        </div>
    );
}
