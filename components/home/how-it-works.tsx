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
        <div className="section-band py-16 md:py-20" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="font-display text-3xl font-bold text-foreground sm:text-4xl bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300 tracking-tight">
                        {dict.how_it_works_title}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {dict.how_it_works_description}
                    </p>
                </div>

                <div className="mt-16 section-reveal">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map((step, index) => (
                            <div key={step.title} className="relative group">
                                <div className="flex flex-col items-center rounded-2xl bg-card/60 dark:bg-card/40 p-6 border border-border/60 shadow-sm card-lift">
                                    <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-brand-50 group-hover:bg-brand-100 text-brand-600 dark:bg-brand-900/50 dark:group-hover:bg-brand-800 dark:text-brand-400 transition-all duration-300 ring-1 ring-brand-100/80 dark:ring-brand-800/80 shadow-inner">
                                        <step.icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <h3 className="mt-4 text-lg font-semibold text-foreground text-center font-display">
                                        {step.title}
                                    </h3>
                                    <p className="mt-2 text-sm text-muted-foreground text-center leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div
                                        className="hidden lg:block absolute top-1/2 start-[calc(50%+4rem)] w-[calc(100%-8rem)] h-px bg-gradient-to-r from-brand-200/80 via-brand-300/60 to-transparent dark:from-brand-800 dark:via-brand-700/60 dark:to-transparent rtl:rotate-180 rtl:start-auto rtl:end-[calc(50%+4rem)]"
                                        style={{ transform: 'translateY(-50%)' }}
                                        aria-hidden
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
