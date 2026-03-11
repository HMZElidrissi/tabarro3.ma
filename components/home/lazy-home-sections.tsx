import { Suspense } from 'react';
import { RevealOnView } from '@/components/custom/reveal-on-view';
import { SectionSkeleton } from '@/components/home/section-skeleton';
import TweetMarquee from '@/components/home/tweet-marquee';

interface LazyTweetMarqueeProps {
    dict: Record<string, unknown>;
}

export function LazyTweetMarquee({ dict }: LazyTweetMarqueeProps) {
    return (
        <RevealOnView>
            <Suspense fallback={<SectionSkeleton />}>
                <TweetMarquee dict={dict} />
            </Suspense>
        </RevealOnView>
    );
}
