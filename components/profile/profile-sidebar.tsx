'use client';

import { User } from '@/types/user';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { getBloodGroupLabel } from '@/config/blood-group';
import { DeleteAccountSection } from '@/components/profile/delete-account-section';

interface ProfileSidebarProps {
    user: User;
    dict: any;
    isRTL?: boolean;
}

function getReadinessScore(user: User): {
    score: number;
    total: number;
    ready: boolean;
    missing: string[];
} {
    const checks = [
        { key: 'name', pass: !!user.name },
        { key: 'phone', pass: !!user.phone },
        { key: 'bloodGroup', pass: !!user.bloodGroup },
        { key: 'city', pass: !!user.cityId },
        { key: 'emailVerified', pass: !!user.emailVerifiedAt },
    ];
    const passing = checks.filter(c => c.pass);
    return {
        score: passing.length,
        total: checks.length,
        ready: passing.length === checks.length,
        // returns keys like 'name', 'phone', 'bloodGroup', 'city', 'email'
        missing: checks.filter(c => !c.pass).map(c => c.key),
    };
}

const BLOOD_GROUP_COLORS: Record<string, string> = {
    'A+': 'from-rose-500 to-red-600',
    'A-': 'from-rose-600 to-red-700',
    'B+': 'from-orange-500 to-red-500',
    'B-': 'from-orange-600 to-red-600',
    'AB+': 'from-purple-500 to-brand-600',
    'AB-': 'from-purple-600 to-brand-700',
    'O+': 'from-brand-500 to-brand-700',
    'O-': 'from-brand-600 to-brand-900',
};

export function ProfileSidebar({ user, dict, isRTL }: ProfileSidebarProps) {
    const readiness = getReadinessScore(user);
    const pct = Math.round((readiness.score / readiness.total) * 100);
    const strokeDash = Math.round((pct / 100) * 251);
    const initials = user.name
        ? user.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : user.email.slice(0, 2).toUpperCase();

    const bloodGradient = user.bloodGroup
        ? (BLOOD_GROUP_COLORS[user.bloodGroup] ?? 'from-brand-500 to-brand-800')
        : null;

    return (
        <aside className="flex flex-col gap-5 w-full">
            {/* ── Hero Card ── */}
            <Card className="relative overflow-hidden border-0 shadow-lg">
                {/* deep red gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 opacity-95" />
                {/* noise texture */}
                <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    }}
                />
                {/* radial highlight */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.15),_transparent_60%)]" />

                <div className="relative flex flex-col items-center gap-5 px-6 pt-8 pb-7">
                    {/* Avatar with readiness ring */}
                    <div className="relative inline-flex">
                        <svg
                            className="absolute -inset-[6px]"
                            width={100}
                            height={100}
                            viewBox="0 0 100 100"
                        >
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="5"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="40"
                                fill="none"
                                stroke={readiness.ready ? '#f59e0b' : '#fbbf24'}
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeDasharray={`${strokeDash} 251`}
                                strokeDashoffset="0"
                                transform="rotate(-90 50 50)"
                                style={{
                                    transition: 'stroke-dasharray 1s ease',
                                }}
                            />
                        </svg>
                        <div className="h-[88px] w-[88px] rounded-full bg-white/10 ring-2 ring-white/20 backdrop-blur-sm flex items-center justify-center">
                            <span className="font-display text-3xl font-black text-white tracking-tight">
                                {initials}
                            </span>
                        </div>
                        {readiness.ready && (
                            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 ring-2 ring-brand-800">
                                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </span>
                        )}
                    </div>

                    {/* Name + readiness message */}
                    <div className="text-center space-y-2">
                        <h2 className="font-display text-xl font-black text-white tracking-tight leading-tight">
                            {user.name || user.email}
                        </h2>
                        {readiness.ready ? (
                            <p className="text-sm font-medium text-amber-300 leading-snug">
                                ✦ {dict.profile.readyToSaveLives}
                            </p>
                        ) : (
                            <div className="space-y-1.5">
                                <p className="text-[11px] text-white/50 uppercase tracking-wider font-semibold">
                                    {dict.profile.missingFields}
                                </p>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {readiness.missing.map(key => (
                                        <span
                                            key={key}
                                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-semibold"
                                        >
                                            <span className="h-1 w-1 rounded-full bg-brand-400 inline-block" />
                                            {dict.profile.missing[key]}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Blood type badge */}
                    {user.bloodGroup && bloodGradient ? (
                        <div
                            className={cn(
                                'flex items-center gap-2 rounded-xl px-5 py-2.5 bg-gradient-to-br text-white shadow-md',
                                bloodGradient,
                            )}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                className="h-5 w-5 fill-white/90"
                            >
                                <path d="M12 2C12 2 5 10.5 5 15a7 7 0 0014 0c0-4.5-7-13-7-13z" />
                            </svg>
                            <span className="latin font-display text-2xl font-black tracking-wider">
                                {getBloodGroupLabel(
                                    user.bloodGroup,
                                    dict,
                                    'request',
                                )}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 rounded-xl px-4 py-2 bg-white/10 text-white/60 text-sm">
                            <ShieldAlert className="h-4 w-4" />
                            {dict.profile.noBloodGroup}
                        </div>
                    )}

                    {/* Completeness progress bar */}
                    <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-xs text-white/60">
                            <span>{dict.profile.profileComplete}</span>
                            <span className="latin font-bold text-white/80">
                                {pct}%
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                                className={cn(
                                    'h-full rounded-full transition-all duration-700',
                                    readiness.ready
                                        ? 'bg-amber-400'
                                        : pct > 50
                                          ? 'bg-amber-400'
                                          : 'bg-brand-400',
                                )}
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                </div>
            </Card>

            {/* ── Danger zone ── */}
            <DeleteAccountSection dict={dict} />
        </aside>
    );
}
