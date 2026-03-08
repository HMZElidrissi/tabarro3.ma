import { Activity, HospitalIcon } from 'lucide-react';
import { UsersIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/20/solid';

export function BenefitsComponent({ dict }: { dict: any }) {
    const benefits = [
        {
            name: dict.donation_benefits.freeHealthCheckUp.title,
            description: dict.donation_benefits.freeHealthCheckUp.description,
            icon: Activity,
        },
        {
            name: dict.donation_benefits.improvedCardiovascularHealth.title,
            description:
                dict.donation_benefits.improvedCardiovascularHealth.description,
            icon: HospitalIcon,
        },
        {
            name: dict.donation_benefits.emotionalSatisfaction.title,
            description:
                dict.donation_benefits.emotionalSatisfaction.description,
            icon: UsersIcon,
        },
        {
            name: dict.donation_benefits.reducedRiskOfCancer.title,
            description: dict.donation_benefits.reducedRiskOfCancer.description,
            icon: HeartIcon,
        },
    ];

    return (
        <div
            className="py-16 section-band"
            id="benefits"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl tracking-tight">
                        {dict.donation_benefits.title}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {dict.donation_benefits.description}
                    </p>
                </div>

                <div className="mt-16">
                    <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {benefits.map(benefit => (
                            <div
                                key={benefit.name}
                                className="relative bg-card rounded-2xl p-6 border border-border/60 shadow-sm card-lift"
                            >
                                <dt className="flex gap-4">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:text-brand-400 flex-shrink-0 ring-1 ring-brand-200/50 dark:ring-brand-800/50">
                                        <benefit.icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="text-lg font-semibold text-foreground font-display pt-0.5">
                                        {benefit.name}
                                    </p>
                                </dt>
                                <dd className="mt-3 ps-16 text-sm text-muted-foreground leading-relaxed">
                                    {benefit.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
