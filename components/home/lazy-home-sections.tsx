'use client';

import dynamic from 'next/dynamic';
import { RevealOnView } from '@/components/custom/reveal-on-view';
import { SectionSkeleton } from '@/components/home/section-skeleton';

const TweetMarquee = dynamic(() => import('@/components/home/tweet-marquee'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
});

const MapComponent = dynamic(() => import('@/components/home/map'), {
    loading: () => <SectionSkeleton />,
    ssr: false,
});

interface LazyHomeSectionsProps {
    dict: Record<string, unknown>;
}

export function LazyTweetMarquee({ dict }: LazyHomeSectionsProps) {
    return (
        <RevealOnView>
            <TweetMarquee dict={dict} />
        </RevealOnView>
    );
}

export function LazyMap({ dict }: LazyHomeSectionsProps) {
    return (
        <RevealOnView>
            <MapComponent dict={dict} />
        </RevealOnView>
    );
}
