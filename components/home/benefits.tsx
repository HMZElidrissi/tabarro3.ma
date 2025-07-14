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
            className="py-16 bg-gradient-to-b from-white to-gray-50"
            id="benefits"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                        {dict.donation_benefits.title}
                    </p>
                    <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                        {dict.donation_benefits.description}
                    </p>
                </div>

                <div className="mt-16">
                    <dl className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {benefits.map(benefit => (
                            <div
                                key={benefit.name}
                                className="relative bg-white rounded-lg p-6 transition-all duration-300 hover:shadow-md border border-gray-100"
                            >
                                <dt className="flex gap-4">
                                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-brand-100 text-brand-600 flex-shrink-0">
                                        <benefit.icon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="text-lg font-medium text-gray-900">
                                        {benefit.name}
                                    </p>
                                </dt>
                                <dd className="mt-2 ps-14 text-sm text-gray-500">
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
