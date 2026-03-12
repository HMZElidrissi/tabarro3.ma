'use client';

import { BloodRequest } from '@/types/blood-request';
import { User } from '@/types/user';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Heart, Sparkles, Star, Trophy, Users, Zap } from 'lucide-react';

interface ProfileImpactWallProps {
    user: User;
    bloodRequests: BloodRequest[];
    dict: any;
    isRTL?: boolean;
}

interface Badge {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
    /** Tailwind bg class for the inner icon circle when earned */
    accentBg: string;
    /** Tailwind text class for the icon when earned */
    accentText: string;
    /** SVG ring color when earned */
    ringColor: string;
    earned: boolean;
}

function computeImpact(requests: BloodRequest[]): number {
    return requests.filter(r => r.status === 'fulfilled').length * 3;
}

function computeBadges(
    user: User,
    requests: BloodRequest[],
    dict: any,
): Badge[] {
    const fulfilled = requests.filter(r => r.status === 'fulfilled').length;
    const total = requests.length;
    const isRareBlood = ['O-', 'AB-', 'B-', 'A-'].includes(
        user.bloodGroup ?? '',
    );
    const hasPhone = !!user.phone;
    const hasBlood = !!user.bloodGroup;
    const hasCity = !!user.cityId;

    return [
        {
            id: 'first-request',
            label: dict.profile.badges.firstRequest,
            description: dict.profile.badges.firstRequestDesc,
            icon: <Zap className="h-5 w-5" />,
            accentBg: 'bg-amber-400',
            accentText: 'text-brand-900',
            ringColor: '#f59e0b',
            earned: total >= 1,
        },
        {
            id: 'hero',
            label: dict.profile.badges.hero,
            description: dict.profile.badges.heroDesc,
            icon: <Trophy className="h-5 w-5" />,
            accentBg: 'bg-amber-300',
            accentText: 'text-brand-900',
            ringColor: '#fcd34d',
            earned: fulfilled >= 3,
        },
        {
            id: 'life-saver',
            label: dict.profile.badges.lifeSaver,
            description: dict.profile.badges.lifeSaverDesc,
            icon: <Heart className="h-5 w-5 fill-current" />,
            accentBg: 'bg-brand-400',
            accentText: 'text-white',
            ringColor: '#f54748',
            earned: fulfilled >= 1,
        },
        {
            id: 'rare-donor',
            label: dict.profile.badges.rareDonor,
            description: dict.profile.badges.rareDonorDesc,
            icon: <Sparkles className="h-5 w-5" />,
            accentBg: 'bg-amber-500',
            accentText: 'text-brand-950',
            ringColor: '#f59e0b',
            earned: isRareBlood,
        },
        {
            id: 'profile-complete',
            label: dict.profile.badges.profileComplete,
            description: dict.profile.badges.profileCompleteDesc,
            icon: <Star className="h-5 w-5 fill-current" />,
            accentBg: 'bg-amber-400',
            accentText: 'text-brand-900',
            ringColor: '#fbbf24',
            earned: hasPhone && hasBlood && hasCity,
        },
        {
            id: 'community',
            label: dict.profile.badges.community,
            description: dict.profile.badges.communityDesc,
            icon: <Users className="h-5 w-5" />,
            accentBg: 'bg-brand-300',
            accentText: 'text-brand-950',
            ringColor: '#fc6d6e',
            earned: (user.participatedCampaigns?.length ?? 0) > 0,
        },
    ];
}

/**
 * Circular medal/stamp badge — mirrors the reference image:
 *   outer SVG ring (amber/brand) → dark maroon body → golden icon circle → label
 *
 * Locked (unearned) badges are fully desaturated and dimmed.
 */
function BadgeStamp({ badge }: { badge: Badge }) {
    if (!badge.earned) {
        return (
            <div
                className="group flex flex-col items-center gap-1.5"
                title={badge.description}
            >
                {/* Circular locked badge */}
                <div className="relative flex h-20 w-20 items-center justify-center">
                    {/* Outer ring SVG */}
                    <svg
                        viewBox="0 0 80 80"
                        className="absolute inset-0 h-full w-full opacity-25"
                    >
                        <circle
                            cx="40"
                            cy="40"
                            r="37"
                            fill="none"
                            stroke="#6b7280"
                            strokeWidth="4"
                            strokeDasharray="4 3"
                        />
                    </svg>
                    {/* Body */}
                    <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-muted/60 text-muted-foreground/40">
                        {badge.icon}
                    </div>
                </div>
                <span className="text-center text-[9px] font-semibold text-muted-foreground/50 leading-tight max-w-[72px]">
                    {badge.label}
                </span>
            </div>
        );
    }

    return (
        <div
            className="group flex flex-col items-center gap-1.5 cursor-default transition-transform duration-300 hover:-translate-y-1"
            title={badge.description}
        >
            {/* ─── Earned: stamp medal ─── */}
            <div className="relative flex h-20 w-20 items-center justify-center">
                {/* Outer amber ring — SVG for precise sizing */}
                <svg
                    viewBox="0 0 80 80"
                    className="absolute inset-0 h-full w-full drop-shadow-sm"
                >
                    {/* Thick outer ring */}
                    <circle
                        cx="40"
                        cy="40"
                        r="37"
                        fill="none"
                        stroke={badge.ringColor}
                        strokeWidth="5"
                    />
                    {/* Inner decorative dot ring */}
                    <circle
                        cx="40"
                        cy="40"
                        r="31"
                        fill="none"
                        stroke={badge.ringColor}
                        strokeWidth="1.2"
                        strokeDasharray="2.5 3.5"
                        opacity="0.6"
                    />
                </svg>

                {/* Dark maroon body circle */}
                <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-brand-900 shadow-inner">
                    {/* Golden inner icon circle */}
                    <div
                        className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-full shadow-md',
                            badge.accentBg,
                            badge.accentText,
                        )}
                    >
                        {badge.icon}
                    </div>
                </div>
            </div>

            {/* Label */}
            <span className="text-center text-[9px] font-bold text-foreground leading-tight max-w-[72px]">
                {badge.label}
            </span>
        </div>
    );
}

export function ProfileImpactWall({
    user,
    bloodRequests,
    dict,
    isRTL,
}: ProfileImpactWallProps) {
    const impact = computeImpact(bloodRequests);
    const badges = computeBadges(user, bloodRequests, dict);
    const earnedCount = badges.filter(b => b.earned).length;

    return (
        <aside className="flex flex-col gap-5 w-full">
            {/* Stats summary */}
            <div className="grid grid-cols-2 gap-3">
                <Card className="border-0 bg-muted/50">
                    <CardContent className="p-4">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            {dict.bloodRequests.myRequests}
                        </p>
                        <p className="latin mt-1 text-2xl font-black text-foreground">
                            {bloodRequests.length}
                        </p>
                    </CardContent>
                </Card>
                <Card className="border-0 bg-brand-50 dark:bg-brand-950/40">
                    <CardContent className="p-4">
                        <p className="text-[10px] uppercase tracking-wider text-brand-700 dark:text-brand-400 font-semibold">
                            {dict.bloodRequests.status.fulfilled}
                        </p>
                        <p className="latin mt-1 text-2xl font-black text-brand-700 dark:text-brand-400">
                            {
                                bloodRequests.filter(
                                    r => r.status === 'fulfilled',
                                ).length
                            }
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Achievement Badges */}
            <Card className="border-0 bg-muted/30">
                <CardContent className="p-5">
                    <div
                        className={cn(
                            'flex items-center justify-between mb-5',
                            isRTL && 'flex-row-reverse',
                        )}
                    >
                        <div>
                            <h3 className="font-display text-sm font-black uppercase tracking-wider">
                                {dict.profile.achievementBadges}
                            </h3>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                <span className="latin font-bold">
                                    {earnedCount}
                                </span>
                                {' / '}
                                <span className="latin">
                                    {badges.length}
                                </span>{' '}
                                {dict.profile.badgesEarned}
                            </p>
                        </div>
                        <Trophy className="h-4 w-4 text-amber-500" />
                    </div>

                    {/* Badge grid — 3 columns */}
                    <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                        {badges.map(badge => (
                            <BadgeStamp key={badge.id} badge={badge} />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Inspirational footer */}
            <div className="rounded-xl border border-brand-200/40 bg-brand-50/60 dark:bg-brand-950/20 dark:border-brand-800/40 px-4 py-3 text-center">
                <p className="text-xs text-brand-700 dark:text-brand-300 font-medium leading-relaxed">
                    {dict.profile.impactQuote}
                </p>
            </div>
        </aside>
    );
}
