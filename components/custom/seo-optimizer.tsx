'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface SEOOptimizerProps {
    pageType: 'home' | 'campaigns' | 'requests' | 'blog';
    locale: string;
    structuredData?: any;
}

export function SEOOptimizer({
    pageType,
    locale,
    structuredData,
}: SEOOptimizerProps) {
    useEffect(() => {
        // Add schema.org structured data for better search results
        if (structuredData) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(structuredData);
            document.head.appendChild(script);

            return () => {
                document.head.removeChild(script);
            };
        }
    }, [structuredData]);

    // Add FAQ structured data for home page
    const getFAQStructuredData = () => {
        if (pageType !== 'home') return null;

        const faqData = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                {
                    '@type': 'Question',
                    name: 'Qui peut donner du sang ? / من يمكنه التبرع بالدم؟',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Les donneurs doivent avoir entre 18 et 65 ans, peser au moins 50 kg, et être en bonne santé générale sans maladies transmissibles par le sang. / يجب أن يكون المتبرعون بين 18 و 65 سنة، ويبلغ وزنهم 50 كجم على الأقل، وأن يكونوا بصحة جيدة دون أي أمراض قابلة للانتقال عبر الدم.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'À quelle fréquence puis-je donner du sang ? / كم مرة يمكنني التبرع بالدم؟',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Les hommes peuvent donner tous les trois mois, et les femmes tous les quatre mois. / يمكن للرجال التبرع كل ثلاثة أشهر، والنساء كل أربعة أشهر.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Quels sont les avantages du don de sang ? / ما هي فوائد التبرع بالدم؟',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Le don de sang offre des bilans de santé gratuits, améliore la santé cardiovasculaire, procure une satisfaction émotionnelle et peut réduire le risque de certains cancers. / يوفر التبرع بالدم فحوصات صحية مجانية، ويحسن صحة القلب والأوعية الدموية، ويوفر رضا عاطفي ويمكن أن يقلل من خطر الإصابة ببعض أنواع السرطان.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Où puis-je donner du sang au Maroc ? / أين يمكنني التبرع بالدم في المغرب؟',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: 'Vous pouvez donner du sang dans les centres régionaux de transfusion sanguine à travers le Maroc. Utilisez notre carte interactive pour trouver le centre le plus proche de votre localisation. / يمكنك التبرع بالدم في مراكز نقل الدم الإقليمية في جميع أنحاء المغرب. استخدم خريطتنا التفاعلية للعثور على أقرب مركز لموقعك.',
                    },
                },
                {
                    '@type': 'Question',
                    name: 'Comment fonctionne tabarro3 ? / كيف يعمل تطبيق تبرع؟',
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: "tabarro3 connecte les donneurs de sang avec ceux qui en ont besoin, organise des campagnes de don et sensibilise à l'importance du don de sang au Maroc. / يربط تطبيق تبرع متبرعي الدم مع المحتاجين، وينظم حملات التبرع ويرفع الوعي بأهمية التبرع بالدم في المغرب.",
                    },
                },
            ],
        };

        // Add language-specific keywords for Moroccan context
        const moroccanKeywords = {
            fr: [
                'don de sang Maroc',
                'centre transfusion sanguine Maroc',
                'campagne don sang',
                'donneur sang volontaire',
                'urgence sang Maroc',
                'banque sang Maroc',
                'don sang bénéfices',
                'critères don sang',
                'don sang sécurité',
                'don sang fréquence',
                'don sang impact',
                'don sang statistiques',
                'don sang sensibilisation Maroc',
                'don sang bénévole',
                'don sang organisation',
                'don sang communauté',
                'don sang vie',
                'don sang hôpital Maroc',
                'don sang région Maroc',
                'don sang ville Maroc',
            ],
            ar: [
                'تبرع بالدم المغرب',
                'مركز نقل الدم المغرب',
                'حملة تبرع بالدم',
                'متبرع دم تطوعي',
                'طوارئ دم المغرب',
                'بنك دم المغرب',
                'فوائد التبرع بالدم',
                'معايير التبرع بالدم',
                'أمان التبرع بالدم',
                'تكرار التبرع بالدم',
                'تأثير التبرع بالدم',
                'إحصائيات التبرع بالدم',
                'توعية التبرع بالدم المغرب',
                'متطوع تبرع بالدم',
                'منظمة تبرع بالدم',
                'مجتمع التبرع بالدم',
                'تبرع بالدم حياة',
                'تبرع بالدم مستشفى المغرب',
                'تبرع بالدم منطقة المغرب',
                'تبرع بالدم مدينة المغرب',
            ],
        };

        // Add keywords to structured data based on locale
        if (locale === 'fr' || locale === 'ar') {
            (faqData as any).keywords = moroccanKeywords[locale as 'fr' | 'ar'];
        }

        return faqData;
    };

    const faqData = getFAQStructuredData();

    return (
        <>
            {/* FAQ Structured Data */}
            {faqData && (
                <Script
                    id="faq-structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqData),
                    }}
                />
            )}

            {/* Local Business Structured Data */}
            <Script
                id="local-business-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'LocalBusiness',
                        name:
                            locale === 'ar'
                                ? 'تبرع - منصة التبرع بالدم'
                                : 'tabarro3 - Plateforme de Don de Sang',
                        alternateName: locale === 'ar' ? 'tabarro3' : 'تبرع',
                        description:
                            locale === 'ar'
                                ? 'منصة مجتمعية تربط متبرعي الدم مع المحتاجين في جميع أنحاء المغرب'
                                : 'Plateforme communautaire connectant les donneurs de sang avec ceux qui en ont besoin à travers le Maroc',
                        url: 'https://tabarro3.ma',
                        address: {
                            '@type': 'PostalAddress',
                            addressCountry: 'MA',
                            addressRegion: locale === 'ar' ? 'المغرب' : 'Maroc',
                            addressLocality:
                                locale === 'ar' ? 'الرباط' : 'Rabat',
                        },
                        geo: {
                            '@type': 'GeoCoordinates',
                            latitude: 33.9716,
                            longitude: -6.8498,
                        },
                        areaServed: {
                            '@type': 'Country',
                            name: locale === 'ar' ? 'المغرب' : 'Maroc',
                        },
                        serviceType:
                            locale === 'ar'
                                ? 'خدمات التبرع بالدم'
                                : 'Services de Don de Sang',
                        availableLanguage:
                            locale === 'ar'
                                ? ['العربية', 'Français']
                                : ['Français', 'العربية'],
                        keywords:
                            locale === 'ar'
                                ? [
                                      'تبرع بالدم المغرب',
                                      'مركز نقل الدم',
                                      'حملة تبرع',
                                      'طوارئ دم',
                                      'بنك دم المغرب',
                                  ]
                                : [
                                      'don de sang Maroc',
                                      'centre transfusion sanguine',
                                      'campagne don',
                                      'urgence sang',
                                      'banque sang Maroc',
                                  ],
                    }),
                }}
            />

            {/* WebSite Structured Data */}
            <Script
                id="website-structured-data"
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: locale === 'ar' ? 'تبرع' : 'tabarro3',
                        alternateName: locale === 'ar' ? 'tabarro3' : 'تبرع',
                        url: 'https://tabarro3.ma',
                        description:
                            locale === 'ar'
                                ? 'منصة التبرع بالدم تربط المتبرعين مع المحتاجين في المغرب'
                                : 'Plateforme de don de sang connectant les donneurs avec ceux qui en ont besoin au Maroc',
                        potentialAction: {
                            '@type': 'DonateAction',
                            target: {
                                '@type': 'EntryPoint',
                                urlTemplate: 'https://tabarro3.ma/requests',
                            },
                        },
                        inLanguage: locale === 'ar' ? 'ar' : 'fr',
                        keywords:
                            locale === 'ar'
                                ? [
                                      'تبرع بالدم',
                                      'المغرب',
                                      'مركز نقل الدم',
                                      'حملة تبرع',
                                      'طوارئ دم',
                                  ]
                                : [
                                      'don de sang',
                                      'Maroc',
                                      'centre transfusion',
                                      'campagne don',
                                      'urgence sang',
                                  ],
                    }),
                }}
            />
        </>
    );
}
