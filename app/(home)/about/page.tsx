import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { Metadata } from 'next';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
    Heart,
    Target,
    Users,
    Info,
    MapPin,
    Newspaper,
    Mail,
    User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressLink as Link } from '@/components/custom/progress-link';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    const lang = await getLocale();

    return {
        title: dict.about?.title || 'About Us | tabarro3',
        description:
            dict.about?.mission?.description ||
            'Learn about tabarro3, our mission to provide accurate information about blood donation in Morocco.',
        openGraph: {
            title: dict.about?.title || 'About Us | tabarro3',
            description:
                dict.about?.mission?.description ||
                'Learn about tabarro3, our mission to provide accurate information about blood donation in Morocco.',
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent(dict.about?.title)}&description=${encodeURIComponent(dict.about?.mission?.description)}`,
                    width: 1200,
                    height: 630,
                    alt: dict.about?.title || 'About Us | tabarro3',
                },
            ],
            locale: lang === 'ar' ? 'ar_MA' : lang === 'fr' ? 'fr_FR' : 'en_US',
            type: 'website',
        },
        twitter: {
            title: dict.about?.title || 'About Us | tabarro3',
            description:
                dict.about?.mission?.description ||
                'Learn about tabarro3, our mission to provide accurate information about blood donation in Morocco.',
            images: [
                {
                    url: `${baseUrl}/api/og?title=${encodeURIComponent(dict.about?.title)}&description=${encodeURIComponent(dict.about?.mission?.description)}`,
                    width: 1200,
                    height: 630,
                    alt: dict.about?.title || 'About Us | tabarro3',
                },
            ],
        },
    };
}

export default async function AboutPage() {
    const dict = await getDictionary();
    const locale = await getLocale();
    const isRTL = locale === 'ar';

    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]" />
                <div className="container mx-auto px-4 py-12 lg:py-16 relative">
                    <div className="text-center">
                        <h1
                            className={cn(
                                'text-3xl md:text-5xl font-bold text-white mb-4',
                                isRTL && 'font-medium',
                            )}>
                            {dict.about?.title}
                        </h1>
                        <p
                            className={cn(
                                'text-lg md:text-xl text-brand-100 mb-6 max-w-4xl mx-auto',
                                isRTL && 'leading-relaxed',
                            )}>
                            {dict.about?.welcome}
                        </p>
                        <div className="flex items-center justify-center space-x-2 rtl:space-x-reverse">
                            <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                            <div className="w-12 h-1 bg-red-400 rounded-full"></div>
                            <Heart className="w-6 h-6 text-red-400 animate-pulse" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div
                            className={cn(
                                'order-2',
                                isRTL ? 'lg:order-2' : 'lg:order-1',
                            )}>
                            <div className="relative">
                                <Card className="border-0 shadow-lg">
                                    <CardContent
                                        className={cn(
                                            'p-6',
                                            isRTL && 'text-right',
                                        )}>
                                        <Target
                                            className={cn(
                                                'w-10 h-10 text-brand-600 mb-4',
                                                isRTL && 'ml-auto',
                                            )}
                                        />
                                        <h2
                                            className={cn(
                                                'text-2xl font-bold mb-3 text-gray-900',
                                                isRTL && 'font-medium',
                                            )}>
                                            {dict.about?.mission?.title}
                                        </h2>
                                        <p
                                            className={cn(
                                                'text-gray-600 leading-relaxed',
                                                isRTL && 'text-right',
                                            )}>
                                            {dict.about?.mission?.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                        <div
                            className={cn(
                                'order-1',
                                isRTL ? 'lg:order-1' : 'lg:order-2',
                            )}>
                            <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-xl">
                                <Image
                                    src="/slider-images/slider-5.jpg"
                                    alt="Rotaract Les Mérinides"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What We Do Section */}
            <section className="py-12 lg:py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2
                            className={cn(
                                'text-2xl md:text-3xl font-bold mb-3 text-gray-900',
                                isRTL && 'font-medium',
                            )}>
                            {dict.about?.whatWeDo?.title}
                        </h2>
                        <div className="w-16 h-1 bg-brand-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Info,
                                key: 'simplified',
                                color: 'bg-blue-100 text-blue-600',
                                data: dict.about?.whatWeDo?.simplified,
                            },
                            {
                                icon: MapPin,
                                key: 'locations',
                                color: 'bg-green-100 text-green-600',
                                data: dict.about?.whatWeDo?.locations,
                            },
                            {
                                icon: Newspaper,
                                key: 'news',
                                color: 'bg-purple-100 text-purple-600',
                                data: dict.about?.whatWeDo?.news,
                            },
                        ].map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <Card
                                    key={item.key}
                                    className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 relative">
                                    <CardContent
                                        className={cn(
                                            'p-6 text-center',
                                            isRTL && 'text-right',
                                        )}>
                                        <div
                                            className={cn(
                                                'absolute top-4 w-10 h-10 rounded-full flex items-center justify-center',
                                                isRTL ? 'left-4' : 'right-4',
                                                item.color,
                                            )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <h3
                                            className={cn(
                                                'text-lg font-bold mb-2 text-gray-900 mt-2',
                                                isRTL && 'font-medium',
                                            )}>
                                            {item.data?.title}
                                        </h3>
                                        <p
                                            className={cn(
                                                'text-gray-600 text-sm leading-relaxed',
                                                isRTL && 'text-right',
                                            )}>
                                            {item.data?.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Why & How Section */}
            <section className="py-12 lg:py-16">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Why We Do This */}
                        <div
                            className={cn(
                                'text-center',
                                isRTL ? 'lg:text-right' : 'lg:text-left',
                            )}>
                            <Heart
                                className={cn(
                                    'w-12 h-12 text-red-500 mx-auto mb-4',
                                    isRTL ? 'lg:mr-0' : 'lg:mx-0',
                                )}
                            />
                            <h2
                                className={cn(
                                    'text-2xl md:text-3xl font-bold mb-4 text-gray-900',
                                    isRTL && 'font-medium',
                                )}>
                                {dict.about?.why?.title}
                            </h2>
                            <p
                                className={cn(
                                    'text-gray-600 leading-relaxed',
                                    isRTL && 'text-right lg:text-right',
                                )}>
                                {dict.about?.why?.description}
                            </p>
                        </div>

                        {/* How You Can Help */}
                        <div
                            className={cn(
                                'text-center',
                                isRTL ? 'lg:text-right' : 'lg:text-left',
                            )}>
                            <Users
                                className={cn(
                                    'w-12 h-12 text-brand-600 mx-auto mb-4',
                                    isRTL ? 'lg:mr-0' : 'lg:mx-0',
                                )}
                            />
                            <h2
                                className={cn(
                                    'text-2xl md:text-3xl font-bold mb-4 text-gray-900',
                                    isRTL && 'font-medium',
                                )}>
                                {dict.about?.howToHelp?.title}
                            </h2>
                            <p
                                className={cn(
                                    'text-gray-600 leading-relaxed mb-6',
                                    isRTL && 'text-right lg:text-right',
                                )}>
                                {dict.about?.howToHelp?.description}
                            </p>
                            <Button
                                asChild
                                className="bg-brand-600 hover:bg-brand-700 text-white">
                                <Link href="/sign-up">
                                    {dict.common?.signUp}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team & Contact Section */}
            <section className="py-12 lg:py-16 bg-gradient-to-r from-brand-600 to-brand-800">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        {/* Team */}
                        <div
                            className={cn(
                                'text-center',
                                isRTL ? 'lg:text-right' : 'lg:text-left',
                            )}>
                            <h2
                                className={cn(
                                    'text-2xl md:text-3xl font-bold mb-6 text-white',
                                    isRTL && 'font-medium',
                                )}>
                                {dict.about?.team?.title}
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                                {dict.about?.team?.members?.map(
                                    (member: any, index: number) => (
                                        <a
                                            key={index}
                                            href={member.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center space-x-3 rtl:space-x-reverse hover:bg-white/20 transition-colors duration-300 group">
                                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-white font-medium text-sm group-hover:text-brand-100 transition-colors duration-300">
                                                {member.name}
                                            </p>
                                        </a>
                                    ),
                                )}
                            </div>
                        </div>

                        {/* Contact */}
                        <div
                            className={cn(
                                'text-center',
                                isRTL ? 'lg:text-right' : 'lg:text-left',
                            )}>
                            <Mail
                                className={cn(
                                    'w-12 h-12 text-white mx-auto mb-4',
                                    isRTL ? 'lg:mr-0' : 'lg:mx-0',
                                )}
                            />
                            <h2
                                className={cn(
                                    'text-2xl md:text-3xl font-bold text-white mb-4',
                                    isRTL && 'font-medium',
                                )}>
                                {dict.about?.contact?.title}
                            </h2>
                            <p
                                className={cn(
                                    'text-brand-100 mb-4',
                                    isRTL && 'text-right lg:text-right',
                                )}>
                                {dict.about?.contact?.description}
                            </p>
                            <a
                                href={`mailto:${dict.about?.contact?.email}`}
                                className="inline-block text-white text-lg font-semibold hover:text-brand-200 transition-colors underline mb-6">
                                {dict.about?.contact?.email}
                            </a>
                            <div className="border-t border-brand-500 pt-6">
                                <p
                                    className={cn(
                                        'text-brand-100',
                                        isRTL && 'text-right lg:text-right',
                                    )}>
                                    {dict.about?.thanks}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
