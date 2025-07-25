import React from 'react';
import { UserPlus, Droplet, Bell, Users } from 'lucide-react';

export default function HowItWorksComponent({ dict }: { dict: any }) {
    const steps = [
        {
            icon: UserPlus,
            title: dict.how_it_works_step1_title,
            description: dict.how_it_works_step1_description,
        },
        {
            icon: Droplet,
            title: dict.how_it_works_step2_title,
            description: dict.how_it_works_step2_description,
        },
        {
            icon: Bell,
            title: dict.how_it_works_step3_title,
            description: dict.how_it_works_step3_description,
        },
        {
            icon: Users,
            title: dict.how_it_works_step4_title,
            description: dict.how_it_works_step4_description,
        },
    ];

    return (
        <div className="bg-background py-16" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-foreground sm:text-4xl bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                        {dict.how_it_works_title}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        {dict.how_it_works_description}
                    </p>
                </div>

                <div className="mt-16">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative group">
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-brand-50 group-hover:bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:group-hover:bg-brand-900 dark:text-brand-400 transition-colors duration-300 ring-1 ring-brand-100 dark:ring-brand-900">
                                        <step.icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-lg font-medium text-foreground text-center">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground text-center leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className="hidden lg:block absolute top-7 start-1/2 w-full h-[1px] bg-gradient-to-r from-brand-100 via-brand-200 to-brand-100 dark:from-brand-800 dark:via-brand-700 dark:to-brand-800 rtl:rotate-180"
                                        style={{
                                            transform:
                                                'translateX(calc(var(--tw-translate-x) + 50%))',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
