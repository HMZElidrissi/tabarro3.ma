import { BlogPost } from '@/types/post';
import { Calendar, Droplets, User, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getBlogPosts } from '@/lib/notion';

interface BlogPostGridProps {
    locale: string;
    dictionary: any;
}

export default async function LatestBlogPosts({
    locale,
    dictionary,
}: BlogPostGridProps) {
    const isRTL = locale === 'ar';
    const posts = await getBlogPosts(locale);

    return (
        <div className="max-w-7xl py-16 mx-auto px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                    {dictionary.blog?.title || 'Blood Donation Blog'}
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    {dictionary.blog?.description ||
                        'Stories and insights on blood donation, donor experiences, and saving lives.'}
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.slice(0, 3).map(post => (
                    <div key={post.id} className="group">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                            {/* Image with hover zoom effect */}
                            <div className="relative h-52 overflow-hidden">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover transform transition-transform group-hover:scale-105"
                                />

                                {/* Category Tag */}
                                {post.tags.length > 0 && (
                                    <div className="absolute top-4 right-4">
                                        <Badge
                                            variant="outline"
                                            className="bg-white/80 backdrop-blur-sm text-brand-600 border-brand-200">
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

                                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-brand-600 transition-colors">
                                    <Link href={`/blog/${post.slug}`}>
                                        {post.title}
                                    </Link>
                                </h3>

                                <p className="text-gray-600 mb-4 text-sm line-clamp-3 flex-grow">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-600 text-sm">
                                        <User
                                            className={cn(
                                                'h-4 w-4 pb-1',
                                                isRTL ? 'ml-1' : 'mr-1',
                                            )}
                                        />
                                        <span>{post.author}</span>
                                    </div>
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center">
                                        {dictionary.blog?.readMore ||
                                            'Read more'}
                                        <ChevronRight
                                            className={`h-3 w-3 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
