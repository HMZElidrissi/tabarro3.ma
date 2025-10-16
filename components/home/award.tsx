'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Award, Star, Trophy } from 'lucide-react';

interface AwardProps {
    dict: any;
    isRTL?: boolean;
}

export default function AwardSection({ dict, isRTL = false }: AwardProps) {
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    };

    const floatingAnimation = {
        y: [-10, 10, -10],
        transition: {
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
        },
    };

    return (
        <section className="relative py-20 bg-gradient-to-br from-brand-50 via-white to-brand-50 overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-32 h-32 bg-brand-200 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-brand-300 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-100 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Award Badge */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-8"
                    >
                        <motion.div
                            animate={floatingAnimation}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-6 py-3 rounded-full font-semibold text-sm shadow-lg"
                        >
                            <Trophy className="w-5 h-5" />
                            <span>{dict.award.badge}</span>
                        </motion.div>
                    </motion.div>

                    <div
                        className={`grid lg:grid-cols-2 gap-12 items-center ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}
                    >
                        {/* Award Image */}
                        <motion.div
                            variants={itemVariants}
                            className={`relative ${isRTL ? 'lg:order-2' : ''}`}
                        >
                            <div className="relative group">
                                {/* Glow effect */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/20 to-brand-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

                                {/* Award image container */}
                                <div className="relative bg-white rounded-2xl p-6 shadow-2xl border border-brand-100 group-hover:shadow-3xl transition-all duration-300">
                                    <div className="relative aspect-square overflow-hidden rounded-xl">
                                        <Image
                                            src="/award.jpeg"
                                            alt={`${dict.award.title} - ${dict.award.subtitle}`}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>

                                    {/* Award year badge */}
                                    <div className="absolute -top-3 -right-3 bg-brand-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                                        {dict.award.year}
                                    </div>
                                </div>

                                {/* Floating icons */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: 20,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                    className="absolute -top-6 -left-6 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <Star
                                        className="w-6 h-6 text-yellow-900"
                                        fill="currentColor"
                                    />
                                </motion.div>

                                <motion.div
                                    animate={{ y: [-5, 5, -5] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="absolute -bottom-6 -right-6 w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                    <Award className="w-6 h-6 text-white" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Award Content */}
                        <motion.div
                            variants={itemVariants}
                            className={`${isRTL ? 'lg:order-1 text-right' : 'text-left'}`}
                        >
                            <motion.h2
                                variants={itemVariants}
                                className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight"
                            >
                                <span className="bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent">
                                    {dict.award.title}
                                </span>
                            </motion.h2>

                            <motion.p
                                variants={itemVariants}
                                className="text-xl text-brand-600 font-semibold mb-6"
                            >
                                {dict.award.subtitle}
                            </motion.p>

                            <motion.p
                                variants={itemVariants}
                                className="text-gray-600 text-lg leading-relaxed"
                            >
                                {dict.award.description}
                            </motion.p>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-brand-400 rounded-full opacity-30"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.5,
                        }}
                        style={{
                            left: `${10 + i * 15}%`,
                            top: `${20 + i * 10}%`,
                        }}
                    />
                ))}
            </div>
        </section>
    );
}
