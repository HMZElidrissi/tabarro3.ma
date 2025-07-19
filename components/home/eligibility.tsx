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
            title:
                dict.eligibility?.basicRequirements?.age?.title ||
                'Age Requirement',
            description:
                dict.eligibility?.basicRequirements?.age?.description ||
                'Between 18 and 60 years old',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: Scale,
            title:
                dict.eligibility?.basicRequirements?.weight?.title ||
                'Weight Requirement',
            description:
                dict.eligibility?.basicRequirements?.weight?.description ||
                'Minimum weight of 50 kg',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
    ];

    const temporaryDeferrals = [
        {
            period:
                dict.eligibility?.temporaryDeferrals?.vaccination?.period ||
                '3 weeks',
            condition:
                dict.eligibility?.temporaryDeferrals?.vaccination?.condition ||
                'Vaccination',
            icon: Shield,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.covid?.period || '1 week',
            condition:
                dict.eligibility?.temporaryDeferrals?.covid?.condition ||
                'COVID-19 immunization',
            icon: Shield,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.animalSerum?.period ||
                '2 weeks',
            condition:
                dict.eligibility?.temporaryDeferrals?.animalSerum?.condition ||
                'Animal serum injection',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.humanSerum?.period ||
                '3 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.humanSerum?.condition ||
                'Human serum treatment',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.dental?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.dental?.condition ||
                'Dental extraction or treatment',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.cupping?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.cupping?.condition ||
                'Cupping or barber shaving',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.surgery?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.surgery?.condition ||
                'Surgery without injection',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.usedSyringe?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.usedSyringe?.condition ||
                'Used syringe injection',
            icon: AlertTriangle,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.endoscopy?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.endoscopy?.condition ||
                'Endoscopy or colonoscopy',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.diarrhea?.period ||
                '1 month',
            condition:
                dict.eligibility?.temporaryDeferrals?.diarrhea?.condition ||
                'Diarrhea',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.inflammation?.period ||
                '1 week after treatment',
            condition:
                dict.eligibility?.temporaryDeferrals?.inflammation?.condition ||
                'Acute inflammation treatment',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.piercing?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.piercing?.condition ||
                'Ear piercing',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.tattoo?.period ||
                '4 months',
            condition:
                dict.eligibility?.temporaryDeferrals?.tattoo?.condition ||
                'Tattoo',
            icon: Activity,
        },
        {
            period:
                dict.eligibility?.temporaryDeferrals?.tuberculosis?.period ||
                '2 years after recovery',
            condition:
                dict.eligibility?.temporaryDeferrals?.tuberculosis?.condition ||
                'Tuberculosis',
            icon: Activity,
        },
    ];

    const permanentDeferrals = [
        dict.eligibility?.permanentDeferrals?.bloodTransfusion ||
            'Previous blood transfusion',
        dict.eligibility?.permanentDeferrals?.leprosy || 'Leprosy',
        dict.eligibility?.permanentDeferrals?.aids || 'AIDS',
        dict.eligibility?.permanentDeferrals?.hepatitis || 'Hepatitis',
    ];

    const medicalDecisionRequired = [
        dict.eligibility?.medicalDecision?.hypertension || 'Hypertension',
        dict.eligibility?.medicalDecision?.diabetes || 'Diabetes',
        dict.eligibility?.medicalDecision?.asthma || 'Asthma',
        dict.eligibility?.medicalDecision?.heartDisease ||
            'Heart, kidney, or lung disease',
        dict.eligibility?.medicalDecision?.neurologicalDisorders ||
            'Neurological disorders (e.g., epilepsy)',
        dict.eligibility?.medicalDecision?.psychiatricDisorders ||
            'Psychiatric disorders',
        dict.eligibility?.medicalDecision?.cancer || 'Cancer (even if treated)',
        dict.eligibility?.medicalDecision?.malaria ||
            'Living in malaria-endemic areas',
        dict.eligibility?.medicalDecision?.england ||
            'Lived in England 1980-1996 for at least one year',
        dict.eligibility?.medicalDecision?.ivDrugs || 'Intravenous drug use',
        dict.eligibility?.medicalDecision?.unprotectedSex ||
            'Multiple sexual partners without protection',
        dict.eligibility?.medicalDecision?.maleRelations ||
            'Sexual relations with other males',
        dict.eligibility?.medicalDecision?.cornealTransplant ||
            'Corneal transplant',
        dict.eligibility?.medicalDecision?.duraMaterTransplant ||
            'Dura mater transplant',
        dict.eligibility?.medicalDecision?.growthHormone ||
            'Growth hormone treatment before 1986',
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Hero Section */}
            <div className="text-center mb-10 relative">
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 opacity-10">
                    <Heart className="w-20 h-20 text-brand-600" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                    {dict.eligibility?.title || 'Blood Donation Eligibility'}
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
                    {dict.eligibility?.description ||
                        'Learn about the requirements and restrictions for blood donation to ensure the safety of both donors and recipients.'}
                </p>

                <div className="mt-4 w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
            </div>

            {/* Basic Requirements */}
            <div className="mb-10">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {dict.eligibility?.basicRequirementsTitle ||
                            'Basic Requirements'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.basicRequirementsSubtitle ||
                            'Essential criteria that all potential donors must meet'}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {basicRequirements.map((req, index) => (
                        <Card
                            key={index}
                            className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-4">
                                <div className="flex items-center mb-2">
                                    <div
                                        className={cn(
                                            'p-2 rounded-full',
                                            req.bgColor,
                                        )}>
                                        <req.icon
                                            className={cn('w-4 h-4', req.color)}
                                        />
                                    </div>
                                    <h3
                                        className={cn(
                                            'text-lg font-semibold text-gray-900',
                                            isRTL ? 'mr-3' : 'ml-3',
                                        )}>
                                        {req.title}
                                    </h3>
                                </div>
                                <p className="text-gray-600 text-sm">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <Clock
                            className={cn(
                                'w-6 h-6 text-yellow-600',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.temporaryDeferralsTitle ||
                            'Temporary Deferrals'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.temporaryDeferralsSubtitle ||
                            'Please postpone your donation for the specified period if you fall into any of these categories'}
                    </p>
                </div>

                <Card className="border-none shadow-md">
                    <CardContent className="p-4">
                        <div className="grid gap-2">
                            {temporaryDeferrals.map((deferral, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200 hover:bg-yellow-100 transition-colors">
                                    <div className="flex items-center">
                                        <deferral.icon
                                            className={cn(
                                                'w-4 h-4 text-yellow-600',
                                                isRTL ? 'ml-2' : 'mr-2',
                                            )}
                                        />
                                        <span className="text-gray-800 font-medium text-sm">
                                            {deferral.condition}
                                        </span>
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs">
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <XCircle
                            className={cn(
                                'w-6 h-6 text-red-600',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.permanentDeferralsTitle ||
                            'Permanent Deferrals'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.permanentDeferralsSubtitle ||
                            'Please do not donate blood if you belong to any of these categories'}
                    </p>
                </div>

                <Alert className="border-red-200 bg-red-50 max-w-3xl mx-auto">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        <div className="grid gap-2 mt-1">
                            {permanentDeferrals.map((deferral, index) => (
                                <div key={index} className="flex items-center">
                                    <div
                                        className={cn(
                                            'w-2 h-2 bg-red-500 rounded-full',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}></div>
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
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <Stethoscope
                            className={cn(
                                'w-6 h-6 text-blue-600',
                                isRTL ? 'ml-2' : 'mr-2',
                            )}
                        />
                        {dict.eligibility?.medicalDecisionTitle ||
                            'Medical Decision Required'}
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                        {dict.eligibility?.medicalDecisionSubtitle ||
                            "Blood donation depends on the patient's health condition (doctor's decision)"}
                    </p>
                </div>

                <Card className="border-none shadow-md max-w-4xl mx-auto">
                    <CardContent className="p-4">
                        <div className="grid md:grid-cols-2 gap-2">
                            {medicalDecisionRequired.map((condition, index) => (
                                <div
                                    key={index}
                                    className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors">
                                    <Stethoscope
                                        className={cn(
                                            'w-4 h-4 text-blue-600 flex-shrink-0',
                                            isRTL ? 'ml-2' : 'mr-2',
                                        )}
                                    />
                                    <span className="text-gray-800 font-medium text-sm">
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
                <Card className="border-none shadow-md bg-gradient-to-r from-brand-500 to-brand-600 text-white max-w-3xl mx-auto">
                    <CardContent className="p-6">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-white" />
                        <h3 className="text-xl font-bold mb-3">
                            {dict.eligibility?.callToAction?.title ||
                                'Ready to Donate?'}
                        </h3>
                        <p className="text-sm mb-4 opacity-90">
                            {dict.eligibility?.callToAction?.description ||
                                'If you meet all the requirements, find a donation campaign near you and help save lives.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                href="/campaigns"
                                className="bg-white text-brand-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">
                                {dict.eligibility?.callToAction
                                    ?.findCampaigns || 'Find Campaigns'}
                            </a>
                            <a
                                href="/requests"
                                className="border-2 border-white text-white px-6 py-2 rounded-lg font-semibold hover:bg-white hover:text-brand-600 transition-colors text-sm">
                                {dict.eligibility?.callToAction
                                    ?.urgentRequests || 'Urgent Requests'}
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
