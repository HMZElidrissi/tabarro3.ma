'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

interface AwardBadgeProps {
    dict: any;
    isRTL?: boolean;
}

export default function AwardBadge({ dict, isRTL = false }: AwardBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center">
            {/* Award Image */}
            <div className="relative mb-4">
                <div className="w-48 h-48 relative overflow-hidden rounded-2xl border-4 border-white/40 shadow-2xl">
                    <Image
                        src="/award.jpeg"
                        alt="Best Innovation Project Award"
                        fill
                        className="object-cover"
                        sizes="192px"
                    />
                </div>

                {/* Floating trophy icon */}
                <motion.div
                    animate={{ y: [-4, 4, -4] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                    <Trophy className="w-6 h-6 text-yellow-900" />
                </motion.div>
            </div>

            {/* Simple Award Text */}
            <div className="text-center">
                <p className="text-white font-semibold text-xl mb-1">
                    {dict.award.title}
                </p>
                <p className="text-white/90 font-medium text-lg">
                    {dict.award.year}
                </p>
            </div>
        </motion.div>
    );
}
