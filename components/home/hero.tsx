'use client';

import Image from 'next/image';
import Link from 'next/link';
import { HeartHandshake, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface HeroComponentProps {
    dict: any;
    isRTL: boolean;
}

export default function HeroComponent({ dict, isRTL }: HeroComponentProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const carouselImages = [
        {
            src: '/slider-images/cover.jpg',
            alt: 'King Mohammed VI donating blood',
        },
        {
            src: '/slider-images/slider-1.jpg',
            alt: 'Blood donation campaign',
        },
        {
            src: '/slider-images/slider-2.jpg',
            alt: 'Blood donation campaign',
        },
        {
            src: '/slider-images/slider-3.jpg',
            alt: 'Blood donation campaign',
        },
        {
            src: '/slider-images/slider-4.jpg',
            alt: 'Blood donation campaign',
        },
        {
            src: '/slider-images/slider-5.jpg',
            alt: 'Blood donation campaign',
        },
    ];

    const nextSlide = () => {
        setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(
            prev => (prev - 1 + carouselImages.length) % carouselImages.length,
        );
    };

    useEffect(() => {
        const timer = setInterval(nextSlide, 5000);
        return () => clearInterval(timer);
    }, []);

    // Determine which function to use based on direction
    const handleNext = isRTL ? prevSlide : nextSlide;
    const handlePrev = isRTL ? nextSlide : prevSlide;

    return (
        <div className="relative overflow-hidden bg-gradient-to-b from-brand-700 via-brand-800 to-brand-900 dark:from-brand-900 dark:via-brand-950 dark:to-background py-14 md:py-20 noise-overlay">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">
                    {/* Left Content Section */}
                    <div className="space-y-6 text-white dark:text-foreground">
                        <div className="inline-block py-4">
                            <Image
                                src="/hero.svg"
                                alt="tabarro3"
                                width={300}
                                height={300}
                                className="filter drop-shadow-lg hover:drop-shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                            />
                        </div>

                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] tracking-tight">
                            {dict.hero_title}
                        </h1>

                        <p className="text-lg md:text-xl text-white/90 dark:text-muted-foreground leading-relaxed max-w-xl">
                            {dict.hero_description}
                        </p>

                        {/* SEO-friendly structured content */}
                        <div className="hidden">
                            <h2>Blood Donation in Morocco</h2>
                            <p>
                                Find blood donation centers, participate in
                                campaigns, and save lives across Morocco. Join
                                our community of blood donors and make a
                                difference in your local community.
                            </p>
                        </div>

                        <Button
                            asChild
                            className="bg-white text-brand-700 hover:bg-brand-50 hover:text-brand-800 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 py-6 px-8 text-lg rounded-xl font-semibold"
                        >
                            <Link
                                href="/requests"
                                className="inline-flex items-center gap-2"
                            >
                                <HeartHandshake className="h-6 w-6" />
                                {dict.donate_button}
                            </Link>
                        </Button>
                    </div>

                    {/* Right Carousel Section */}
                    <div
                        className={`relative aspect-[6/3] w-full ${isRTL ? 'lg:order-1' : 'lg:order-2'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/25 to-transparent rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                            <div className="relative h-full w-full">
                                {carouselImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`absolute inset-0 transition-opacity duration-500 ${
                                            index === currentSlide
                                                ? 'opacity-100'
                                                : 'opacity-0'
                                        }`}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            fill
                                            className="object-cover rounded-2xl"
                                        />
                                    </div>
                                ))}

                                {/* Carousel Controls */}
                                <div className="absolute inset-0 flex items-center justify-between p-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handlePrev}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white dark:bg-black/20 dark:hover:bg-black/30 dark:border-white/20 dark:text-foreground rounded-full"
                                    >
                                        {isRTL ? (
                                            <ChevronRight className="h-6 w-6" />
                                        ) : (
                                            <ChevronLeft className="h-6 w-6" />
                                        )}
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={handleNext}
                                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30 text-white dark:bg-black/20 dark:hover:bg-black/30 dark:border-white/20 dark:text-foreground rounded-full"
                                    >
                                        {isRTL ? (
                                            <ChevronLeft className="h-6 w-6" />
                                        ) : (
                                            <ChevronRight className="h-6 w-6" />
                                        )}
                                    </Button>
                                </div>

                                {/* Carousel Indicators */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                    {carouselImages.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                setCurrentSlide(index)
                                            }
                                            className={`h-2 w-2 rounded-full transition-all duration-300 ${
                                                index === currentSlide
                                                    ? 'bg-white dark:bg-primary w-8'
                                                    : 'bg-white/50 hover:bg-white/75 dark:bg-muted-foreground/50 dark:hover:bg-muted-foreground/75'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-radial from-brand-500/25 to-transparent opacity-60 dark:opacity-35" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-radial from-brand-500/20 to-transparent opacity-50 dark:opacity-25" />
            </div>
        </div>
    );
}
