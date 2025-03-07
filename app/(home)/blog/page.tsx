import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { getBlogPosts } from '@/lib/notion';
import { Metadata } from 'next';
import { Calendar, ChevronRight, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import BlogPostGrid from '@/components/blog/blog-post-grid';

export const revalidate = 3600;

export async function generateStaticParams() {
    return [{}];
}

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();

    return {
        title: dict.blog?.title || 'Blog | tabarro3',
        description:
            dict.blog?.description ||
            'The latest blood donation news and articles',
    };
}

export default async function BlogPage() {
    const dict = await getDictionary();
    const locale = await getLocale();
    const isRTL = locale === 'ar';
    const posts = await getBlogPosts(locale);

    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);

    return (
        <div className="bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-4 py-16">
                {/* Page Header */}
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-10">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-brand-600">
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                        {dict.blog?.title || 'Blood Donation Blog'}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {dict.blog?.description ||
                            'Stories and insights on blood donation, donor experiences, and saving lives.'}
                    </p>

                    <div className="mt-8 w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>
                </div>

                {/* Featured Post */}
                {featuredPost && (
                    <div className="mb-16">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:shadow-xl">
                            <div className="md:flex">
                                <div className="md:w-1/2 relative h-64 md:h-auto">
                                    <Image
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <Badge
                                            variant="secondary"
                                            className="bg-brand-600 text-white hover:bg-brand-700 px-3 py-1 text-sm">
                                            {dict.blog?.featured || 'Featured'}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center text-gray-500 mb-4">
                                            <Calendar
                                                className={cn(
                                                    'h-5 w-5 pb-1',
                                                    isRTL ? 'ml-2' : 'mr-2',
                                                )}
                                            />
                                            <span className="text-sm">
                                                {formatDate(
                                                    featuredPost.publishDate,
                                                    locale,
                                                )}
                                            </span>
                                            <span className="mx-2 text-lg font-semibold">
                                                •
                                            </span>
                                            <User
                                                className={cn(
                                                    'h-5 w-5 pb-1',
                                                    isRTL ? 'ml-2' : 'mr-2',
                                                )}
                                            />
                                            <span className="text-sm">
                                                {featuredPost.author}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-brand-600 transition-colors">
                                            <Link
                                                href={`/blog/${featuredPost.slug}`}>
                                                {featuredPost.title}
                                            </Link>
                                        </h2>
                                        <p className="text-gray-600 mb-6 line-clamp-3">
                                            {featuredPost.excerpt}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/blog/${featuredPost.slug}`}
                                        className="inline-flex items-center text-brand-600 hover:text-brand-700 font-medium">
                                        {dict.blog?.readMore || 'Read more'}
                                        <ChevronRight
                                            className={`h-4 w-4 ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`}
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <BlogPostGrid
                    posts={regularPosts}
                    locale={locale}
                    dictionary={dict}
                />
            </div>
        </div>
    );
}
