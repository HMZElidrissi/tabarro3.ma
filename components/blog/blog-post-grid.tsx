import { BlogPost } from '@/types/post';
import { Calendar, Droplets, ChevronRight } from 'lucide-react';
import { ProgressLink as Link } from '@/components/custom/progress-link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BlogPostGridProps {
    posts: BlogPost[];
    locale: string;
    dictionary: any;
}

export default function BlogPostGrid({
    posts,
    locale,
    dictionary,
}: BlogPostGridProps) {
    const isRTL = locale === 'ar';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
                <div key={post.id} className="group">
                    <div className="bg-card rounded-lg shadow-sm border overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-border/80">
                        {/* Compact Image */}
                        <div className="relative h-40 overflow-hidden">
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform group-hover:scale-102"
                            />

                            {/* Compact Category Tag */}
                            {post.tags.length > 0 && (
                                <div className="absolute top-3 right-3">
                                    <Badge
                                        variant="outline"
                                        className="bg-card/80 backdrop-blur-sm text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800"
                                    >
                                        <Droplets className="h-3 w-3 mr-1" />
                                        {post.tags[0]}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            {/* Date and reading time */}
                            <div className="flex items-center text-muted-foreground text-sm mb-3">
                                <Calendar
                                    className={cn(
                                        'h-4 w-4 pb-1',
                                        isRTL ? 'ml-1' : 'mr-1',
                                    )}
                                />
                                <span>
                                    {formatDate(post.publishDate, locale)}
                                </span>
                            </div>

                            <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-tight">
                                <Link href={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h3>

                            <p className="text-muted-foreground mb-3 text-xs line-clamp-3 flex-grow leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Compact Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.slice(0, 2).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs hover:bg-muted/80 transition-colors"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 2 && (
                                    <span className="text-muted-foreground/70 text-xs">
                                        +{post.tags.length - 2}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium flex items-center group/link px-2 py-1 rounded hover:bg-muted/30 transition-colors"
                                >
                                    {dictionary.blog?.readMore || 'Read more'}
                                    <ChevronRight
                                        className={cn(
                                            'h-3 w-3 transition-transform group-hover/link:translate-x-0.5',
                                            isRTL
                                                ? 'mr-1 rotate-180 group-hover/link:-translate-x-0.5'
                                                : 'ml-1',
                                        )}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
