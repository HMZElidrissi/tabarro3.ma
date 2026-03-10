'use client';

import dynamic from 'next/dynamic';
import { RevealOnView } from '@/components/custom/reveal-on-view';
import { SectionSkeleton } from '@/components/home/section-skeleton';

const MapComponent = dynamic(() => import('@/components/home/map'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
});

interface LazyMapProps {
    dict: Record<string, unknown>;
}

export function LazyMap({ dict }: LazyMapProps) {
    return (
        <RevealOnView>
            <MapComponent dict={dict} />
        </RevealOnView>
    );
}
