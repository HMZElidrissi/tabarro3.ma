import { BlogPost } from '@/types/post';
import { Calendar, Droplets, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
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
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md">
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
                                        className="bg-white/80 backdrop-blur-sm text-brand-600 border-brand-200"
                                    >
                                        <Droplets className="h-3 w-3 mr-1" />
                                        {post.tags[0]}
                                    </Badge>
                                </div>
                            )}
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            {/* Date and reading time */}
                            <div className="flex items-center text-gray-500 text-sm mb-3">
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

                            <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                                <Link href={`/blog/${post.slug}`}>
                                    {post.title}
                                </Link>
                            </h3>

                            <p className="text-gray-600 mb-3 text-xs line-clamp-3 flex-grow leading-relaxed">
                                {post.excerpt}
                            </p>

                            {/* Compact Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.slice(0, 2).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                        {tag}
                                    </span>
                                ))}
                                {post.tags.length > 2 && (
                                    <span className="text-gray-400 text-xs">
                                        +{post.tags.length - 2}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-end">
                                <Link
                                    href={`/blog/${post.slug}`}
                                    className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center group/link">
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
