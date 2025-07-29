import type React from 'react';
/* eslint-disable @next/next/no-img-element */
import { Suspense } from 'react';
import {
    enrichTweet,
    type EnrichedTweet,
    type TweetProps,
    type TwitterComponents,
} from 'react-tweet';
import { getTweet, type Tweet } from 'react-tweet/api';

import { cn } from '@/lib/utils';

interface TwitterIconProps {
    className?: string;
    [key: string]: unknown;
}
const Twitter = ({ className, ...props }: TwitterIconProps) => (
    <svg
        viewBox="0 0 128 128"
        className={`fill-black dark:fill-white ${className}`}
        height="1em"
        width="1em"
        {...props}>
        <path d="M75.916 54.2 122.542 0h-11.05L71.008 47.06 38.672 0H1.376l48.898 71.164L1.376 128h11.05L55.18 78.303 89.328 128h37.296L75.913 54.2ZM60.782 71.79l-4.955-7.086-39.42-56.386h16.972L65.19 53.824l4.954 7.086 41.353 59.15h-16.97L60.782 71.793Z"></path>
    </svg>
);

const Verified = ({ className, ...props }: TwitterIconProps) => (
    <svg
        aria-label="Verified Account"
        viewBox="0 0 24 24"
        className={className}
        {...props}>
        <g fill="currentColor">
            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
        </g>
    </svg>
);

export const truncate = (str: string | null, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length - 3)}...`;
};

const Skeleton = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn('rounded-md bg-primary/10', className)} {...props} />
    );
};

export const TweetSkeleton = ({
    className,
    ...props
}: {
    className?: string;
    [key: string]: unknown;
}) => (
    <div
        className={cn(
            'flex size-full max-h-max min-w-72 flex-col gap-2 rounded-lg border p-4',
            className,
        )}
        {...props}>
        <div className="flex flex-row gap-2">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-20 w-full" />
    </div>
);

export const TweetNotFound = ({
    className,
    ...props
}: {
    className?: string;
    [key: string]: unknown;
}) => (
    <div
        className={cn(
            'flex size-full flex-col items-center justify-center gap-2 rounded-lg border p-4',
            className,
        )}
        {...props}>
        <h3 className="text-sm text-muted-foreground">Tweet not found</h3>
    </div>
);

export const TweetHeader = ({ tweet }: { tweet: EnrichedTweet }) => (
    <div className="flex flex-row justify-between tracking-tight">
        <div className="flex items-center space-x-2">
            <a href={tweet.user.url} target="_blank" rel="noreferrer">
                <img
                    title={`Profile picture of ${tweet.user.name}`}
                    alt={tweet.user.screen_name}
                    height={48}
                    width={48}
                    src={
                        tweet.user.profile_image_url_https || '/placeholder.svg'
                    }
                    className="overflow-hidden rounded-full border border-transparent"
                />
            </a>
            <div>
                <a
                    href={tweet.user.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center whitespace-nowrap font-semibold">
                    {truncate(tweet.user.name, 20)}
                    {tweet.user.verified ||
                        (tweet.user.is_blue_verified && (
                            <Verified className="ml-1 inline size-4 text-blue-500" />
                        ))}
                </a>
                <div className="flex items-center space-x-1">
                    <a
                        href={tweet.user.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-gray-500 transition-all duration-75">
                        @{truncate(tweet.user.screen_name, 16)}
                    </a>
                </div>
            </div>
        </div>
        <a href={tweet.url} target="_blank" rel="noreferrer">
            <span className="sr-only">Link to tweet</span>
            <Twitter className="size-5 items-start text-[#3BA9EE] transition-all ease-in-out hover:scale-105" />
        </a>
    </div>
);

export const TweetBody = ({ tweet }: { tweet: EnrichedTweet }) => (
    <div className="break-words leading-normal tracking-tighter">
        {tweet.entities.map((entity, idx) => {
            switch (entity.type) {
                case 'url':
                case 'symbol':
                case 'hashtag':
                case 'mention':
                    return (
                        <a
                            key={idx}
                            href={entity.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-normal text-blue-500 hover:underline">
                            <span>{entity.text}</span>
                        </a>
                    );
                case 'text':
                    return (
                        <span
                            key={idx}
                            className="text-sm font-normal"
                            dangerouslySetInnerHTML={{ __html: entity.text }}
                        />
                    );
            }
        })}
    </div>
);

export const TweetMedia = ({ tweet }: { tweet: EnrichedTweet }) => {
    if (!tweet.video && !tweet.photos) return null;
    return (
        <div className="flex flex-1 items-center justify-center">
            {tweet.video && (
                <video
                    poster={tweet.video.poster}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-48 rounded-xl border shadow-sm">
                    <source
                        src={tweet.video.variants[0].src}
                        type="video/mp4"
                    />
                    Your browser does not support the video tag.
                </video>
            )}
            {tweet.photos && (
                <div className="relative flex transform-gpu snap-x snap-mandatory gap-4 overflow-x-auto">
                    <div className="shrink-0 snap-center sm:w-2" />
                    {tweet.photos.map(photo => (
                        <img
                            key={photo.url}
                            src={photo.url || '/placeholder.svg'}
                            title={'Photo by ' + tweet.user.name}
                            alt={tweet.text}
                            className="h-48 w-5/6 shrink-0 snap-center snap-always rounded-xl border object-cover shadow-sm"
                        />
                    ))}
                    <div className="shrink-0 snap-center sm:w-2" />
                </div>
            )}
            {!tweet.video &&
                !tweet.photos &&
                // @ts-ignore
                tweet?.card?.binding_values?.thumbnail_image_large?.image_value
                    .url && (
                    <img
                        src={
                            // @ts-ignore
                            tweet.card.binding_values.thumbnail_image_large
                                .image_value.url || '/placeholder.svg'
                        }
                        className="h-64 rounded-xl border object-cover shadow-sm"
                        alt={tweet.text}
                    />
                )}
        </div>
    );
};

export const MagicTweet = ({
    tweet,
    components,
    className,
    ...props
}: {
    tweet: Tweet;
    components?: TwitterComponents;
    className?: string;
}) => {
    // Add null check before enriching tweet
    if (!tweet) {
        const NotFound = components?.TweetNotFound || TweetNotFound;
        return <NotFound className={className} {...props} />;
    }

    const enrichedTweet = enrichTweet(tweet);
    return (
        <div
            className={cn(
                'relative flex w-full max-w-lg flex-col gap-2 overflow-hidden rounded-lg border bg-card p-4 backdrop-blur-md',
                // Dynamic height based on media content
                enrichedTweet.photos || enrichedTweet.video
                    ? 'h-auto min-h-[400px]'
                    : 'h-auto min-h-[200px]',
                className,
            )}
            {...props}>
            <TweetHeader tweet={enrichedTweet} />
            <TweetBody tweet={enrichedTweet} />
            <TweetMedia tweet={enrichedTweet} />
        </div>
    );
};

/**
 * TweetCard (Server Side Only)
 */
export const TweetCard = async ({
    id,
    components,
    fallback = <TweetSkeleton />,
    onError,
    ...props
}: TweetProps & {
    className?: string;
}) => {
    if (!id) {
        const NotFound = components?.TweetNotFound || TweetNotFound;
        return <NotFound {...props} />;
    }

    try {
        const tweet = await getTweet(id);

        if (!tweet) {
            const NotFound = components?.TweetNotFound || TweetNotFound;
            return <NotFound {...props} />;
        }

        return (
            <Suspense fallback={fallback}>
                <MagicTweet tweet={tweet} components={components} {...props} />
            </Suspense>
        );
    } catch (err) {
        if (onError) {
            onError(err);
        } else {
            console.error('Error fetching tweet:', err);
        }

        const NotFound = components?.TweetNotFound || TweetNotFound;
        return <NotFound {...props} />;
    }
};
