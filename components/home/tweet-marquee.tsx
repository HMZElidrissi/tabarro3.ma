import { TweetCard } from '@/components/custom/tweet-card';
import Marquee from '@/components/custom/marquee';

const tweetIds = [
    '1890151149543825712',
    '1889857144721383926',
    '1889763723138552006',
    '1889726285796008182',
    '1889733420537774501',
    '1890073924878336496',
];

interface TweetMarqueeProps {
    dict: any;
}

export default function TweetMarquee({ dict }: TweetMarqueeProps) {
    return (
        <div className="relative flex max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-col items-center justify-center overflow-hidden bg-background">
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                {dict.testimonials?.title || 'What they say about us'}
            </h1>

            <div className="mt-8">
                <Marquee reverse pauseOnHover className="[--duration:60s]">
                    {tweetIds
                        .slice()
                        .reverse()
                        .map(id => (
                            <div key={`reverse-${id}`} className="mx-2">
                                <TweetCard id={id} className="shadow-lg w-80" />
                            </div>
                        ))}
                </Marquee>
            </div>
        </div>
    );
}
