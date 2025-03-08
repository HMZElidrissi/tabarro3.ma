import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import { getBlogPost, getRelatedPosts } from '@/lib/notion';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, Tag as TagIcon, User } from 'lucide-react';
import MdxComponents from '@/components/custom/mdx-components';
import { MDXRemote } from 'next-mdx-remote/rsc';
import ReadingProgressBar from '@/components/blog/reading-progress-bar';
import ShareButtons from '@/components/blog/share-buttons';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    try {
        const locale = await getLocale();
        const post = await getBlogPost(slug, locale);

        const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/og-image/${slug}`;

        if (!post) {
            return {
                title: 'Blog Post Not Found | tabarro3',
            };
        }

        return {
            title: post.title,
            description: post.excerpt,
            openGraph: {
                title: post.title,
                description: post.excerpt,
                images: [ogImageUrl],
            },
            twitter: {
                title: post.title,
                description: post.excerpt,
                images: [ogImageUrl],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Blog Post | tabarro3',
        };
    }
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const dict = await getDictionary();
    const locale = await getLocale();
    const isRTL = locale === 'ar';

    const post = await getBlogPost(slug, locale);

    if (!post) {
        notFound();
    }

    const relatedPosts = await getRelatedPosts(slug, post.tags, locale);

    return (
        <>
            <ReadingProgressBar />

            {/* Hero Banner */}
            <div className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/80"></div>

                <div className="container mx-auto px-4 h-full flex items-end">
                    <div className="relative pb-12 text-white">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                                    <TagIcon className="w-3 h-3 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center">
                            <Calendar
                                className={cn(
                                    'h-5 w-5 pb-1',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            <span className="text-sm">
                                {formatDate(post.publishDate, locale)}
                            </span>
                            <span className="mx-2 text-lg font-semibold"></span>
                            <User
                                className={cn(
                                    'h-5 w-5 pb-1',
                                    isRTL ? 'ml-2' : 'mr-2',
                                )}
                            />
                            <span className="text-sm">{post.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main content */}
                    <article className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 md:p-10 mb-4">
                        <div className="prose prose-lg max-w-none">
                            {typeof post.content === 'string' && (
                                <MDXRemote
                                    source={post.content}
                                    components={MdxComponents}
                                    options={{
                                        mdxOptions: {
                                            remarkPlugins: [],
                                            rehypePlugins: [],
                                        },
                                    }}
                                />
                            )}
                        </div>

                        {/* Article footer with social sharing */}
                        <div className="mt-12 pt-6 border-t border-gray-100">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <ShareButtons
                                url={`${process.env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`}
                                title={post.title}
                                description={post.excerpt}
                                dict={dict}
                            />
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="space-y-4">
                        {/* Back to blog */}
                        <div className="pt-6">
                            <Link
                                href="/blog"
                                className="inline-flex items-center text-brand-600 hover:text-brand-700 hover:underline font-medium">
                                <ChevronLeft
                                    className={cn(
                                        'h-5 w-5',
                                        isRTL ? 'ml-2 pb-1 order-last' : 'mr-2',
                                    )}
                                />
                                <span>
                                    {dict.blog?.backToBlog || 'Back to Blog'}
                                </span>
                            </Link>
                        </div>

                        {/* Author box */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <h3 className="text-lg font-bold mb-4 text-gray-900">
                                {dict.blog?.aboutAuthor || 'About the Author'}
                            </h3>
                            <div className="flex items-center">
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center',
                                        isRTL ? 'ml-2' : 'mr-2',
                                    )}>
                                    <User className="w-6 h-6 text-brand-600" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">
                                        {post.author}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Call to action */}
                        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl shadow-md p-6 text-white">
                            <h3 className="text-lg font-bold mb-3">
                                {dict.blog?.donateNow || 'Donate Blood Today'}
                            </h3>
                            <p className="mb-4 text-white/80">
                                {dict.blog?.donateMessage ||
                                    'Your donation can save up to three lives. Find donation centers near you.'}
                            </p>
                            <Link
                                href="/campaigns"
                                className="inline-block bg-white text-brand-600 font-medium px-4 py-2 rounded-md hover:bg-white/90 transition-colors">
                                {dict.blog?.findCampaigns || 'Find Campaigns'}
                            </Link>
                        </div>

                        {/* Related posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-bold mb-4 text-gray-900">
                                    {dict.blog?.relatedPosts || 'Related Posts'}
                                </h3>
                                <div className="space-y-4">
                                    {relatedPosts.map(post => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}>
                                            <div className="flex gap-3 group">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <span className="text-gray-500 text-sm">
                                                        {formatDate(
                                                            post.publishDate,
                                                            locale,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </>
    );
}
