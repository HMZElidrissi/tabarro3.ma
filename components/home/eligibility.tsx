'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Heart,
    Scale,
    Clock,
    AlertTriangle,
    XCircle,
    Stethoscope,
    Shield,
    CheckCircle,
    User,
    Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EligibilityProps {
    dict: any;
    isRTL: boolean;
}

export function EligibilityComponent({ dict, isRTL }: EligibilityProps) {
    const basicRequirements = [
        {
            icon: User,
            title: dict.eligibility?.basicRequirements?.age?.title,
            description: dict.eligibility?.basicRequirements?.age?.description,
            color: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-950/50',
        },
        {
            icon: Scale,
            title: dict.eligibility?.basicRequirements?.weight?.title,
            description:
                dict.eligibility?.basicRequirements?.weight?.description,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/50',
        },
    ];

    const temporaryDeferrals = [
        {
            period: dict.eligibility?.temporaryDeferrals?.vaccination?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.vaccination?.condition,
            icon: Shield,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.covid?.period,
            condition: dict.eligibility?.temporaryDeferrals?.covid?.condition,
            icon: Shield,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.animalSerum?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.animalSerum?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.humanSerum?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.humanSerum?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.dental?.period,
            condition: dict.eligibility?.temporaryDeferrals?.dental?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.cupping?.period,
            condition: dict.eligibility?.temporaryDeferrals?.cupping?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.surgery?.period,
            condition: dict.eligibility?.temporaryDeferrals?.surgery?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.usedSyringe?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.usedSyringe?.condition,
            icon: AlertTriangle,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.endoscopy?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.endoscopy?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.diarrhea?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.diarrhea?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.inflammation?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.inflammation?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.piercing?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.piercing?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.tattoo?.period,
            condition: dict.eligibility?.temporaryDeferrals?.tattoo?.condition,
            icon: Activity,
        },
        {
            period: dict.eligibility?.temporaryDeferrals?.tuberculosis?.period,
            condition:
                dict.eligibility?.temporaryDeferrals?.tuberculosis?.condition,
            icon: Activity,
        },
    ];

    const permanentDeferrals = [
        dict.eligibility?.permanentDeferrals?.bloodTransfusion,
        dict.eligibility?.permanentDeferrals?.leprosy,
        dict.eligibility?.permanentDeferrals?.aids,
        dict.eligibility?.permanentDeferrals?.hepatitis,
    ];

    const medicalDecisionRequired = [
        dict.eligibility?.medicalDecision?.hypertension,
        dict.eligibility?.medicalDecision?.diabetes,
        dict.eligibility?.medicalDecision?.asthma,
        dict.eligibility?.medicalDecision?.heartDisease,
        dict.eligibility?.medicalDecision?.neurologicalDisorders,
        dict.eligibility?.medicalDecision?.psychiatricDisorders,
        dict.eligibility?.medicalDecision?.cancer,
        dict.eligibility?.medicalDecision?.malaria,
        dict.eligibility?.medicalDecision?.england,
        dict.eligibility?.medicalDecision?.ivDrugs,
        dict.eligibility?.medicalDecision?.unprotectedSex,
        dict.eligibility?.medicalDecision?.maleRelations,
        dict.eligibility?.medicalDecision?.cornealTransplant,
        dict.eligibility?.medicalDecision?.duraMaterTransplant,
        dict.eligibility?.medicalDecision?.growthHormone,
    ];

    return (
        <div className="container mx-auto px-4 py-16">
            {/* Hero Section */}
            <div className="text-center mb-10 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-10">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="text-brand-600 dark:text-brand-400"
                    >
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                    {dict.eligibility?.title}
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
                    {dict.eligibility?.description}
                </p>

                <div className="mt-4 w-16 h-1 bg-brand-500 dark:bg-brand-400 mx-auto rounded-full"></div>
            </div>

            {/* Basic Requirements */}
            <div className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {dict.eligibility?.basicRequirementsTitle}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.basicRequirementsSubtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {basicRequirements.map((req, index) => (
                        <Card
                            key={index}
                            className="border-none shadow-md hover:shadow-lg transition-shadow duration-300 bg-card"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <div
                                        className={cn(
                                            'p-2 rounded-full',
                                            req.bgColor,
                                        )}
                                    >
                                        <req.icon
                                            className={cn('w-4 h-4', req.color)}
                                        />
                                    </div>
                                    <h3
                                        className={cn(
                                            'text-lg font-semibold text-foreground',
                                            isRTL ? 'mr-3' : 'ml-3',
                                        )}
                                    >
                                        {req.title}
                                    </h3>
                                </div>
                                <p className="text-muted-foreground text-sm">
                                    {req.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Temporary Deferrals */}
            <div className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
                        <Clock
                            className={cn(
                                'w-6 h-6 text-yellow-600 dark:text-yellow-400',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.temporaryDeferralsTitle}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.temporaryDeferralsSubtitle}
                    </p>
                </div>

                <Card className="border-none shadow-md bg-card">
                    <CardContent className="p-4">
                        <div className="grid gap-2">
                            {temporaryDeferrals.map((deferral, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-950/50 transition-colors"
                                >
                                    <div className="flex items-center">
                                        <deferral.icon
                                            className={cn(
                                                'w-4 h-4 text-yellow-600 dark:text-yellow-400',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        <span className="text-foreground font-medium text-sm">
                                            {deferral.condition}
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700 text-xs"
                                    >
                                        {deferral.period}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Permanent Deferrals */}
            <div className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
                        <XCircle
                            className={cn(
                                'w-6 h-6 text-red-600 dark:text-red-400',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.permanentDeferralsTitle}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.permanentDeferralsSubtitle}
                    </p>
                </div>

                <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 max-w-3xl mx-auto">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                        <div className="grid gap-2 mt-1">
                            {permanentDeferrals.map((deferral, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className={cn(
                                            'w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    ></div>
                                    <span className="font-medium text-sm">
                                        {deferral}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AlertDescription>
                </Alert>
            </div>

            {/* Medical Decision Required */}
            <div className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center">
                        <Stethoscope
                            className={cn(
                                'w-6 h-6 text-blue-600 dark:text-blue-400',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.medicalDecisionTitle}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.medicalDecisionSubtitle}
                    </p>
                </div>

                <Card className="border-none shadow-md max-w-4xl mx-auto bg-card">
                    <CardContent className="p-4">
                        <div className="grid md:grid-cols-2 gap-2">
                            {medicalDecisionRequired.map((condition, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
                                >
                                    <Stethoscope
                                        className={cn(
                                            'w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    <span className="text-foreground font-medium text-sm">
                                        {condition}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Call to Action */}
            <div className="text-center">
                <Card className="border-none shadow-md bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-700 dark:to-brand-800 text-white max-w-3xl mx-auto">
                    <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-white" />
                        <h3 className="text-xl font-bold mb-3">
                            {dict.eligibility?.callToAction?.title}
                        </h3>
                        <p className="text-sm mb-4 opacity-90">
                            {dict.eligibility?.callToAction?.description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="/campaigns"
                                className="bg-white text-brand-600 dark:bg-card dark:text-foreground px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-muted transition-colors text-sm"
                            >
                                {dict.eligibility?.callToAction?.findCampaigns}
                            </a>
                            <a
                                href="/requests"
                                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-brand-600 dark:hover:bg-card dark:hover:text-foreground transition-colors text-sm"
                            >
                                {dict.eligibility?.callToAction?.urgentRequests}
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
