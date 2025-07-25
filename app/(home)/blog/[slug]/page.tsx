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

        const ogImageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/blog-image/${slug}`;

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

            {/* Compact Hero Banner */}
            <div className="relative h-[35vh] min-h-[280px]">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>

                <div className="container mx-auto px-4 h-full flex items-end">
                    <div className="relative pb-8 text-white max-w-4xl">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                            {post.tags.slice(0, 3).map(tag => (
                                <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs text-white border-white/30 bg-white/10 backdrop-blur-sm px-2 py-1">
                                    <TagIcon className="w-2.5 h-2.5 mr-1" />
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 line-clamp-2">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-sm opacity-90">
                            <Calendar
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-1.5' : 'mr-1.5',
                                )}
                            />
                            <span>{formatDate(post.publishDate, locale)}</span>
                            <span className="mx-3">•</span>
                            <User
                                className={cn(
                                    'h-4 w-4',
                                    isRTL ? 'ml-1.5' : 'mr-1.5',
                                )}
                            />
                            <span>{post.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main content */}
                    <article className="lg:col-span-3 bg-card rounded-lg shadow-sm border p-6">
                        <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-strong:text-foreground">
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

                        {/* Compact Article footer */}
                        <div className="mt-8 pt-4 border-t">
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {post.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2.5 py-1 bg-muted text-muted-foreground rounded-full text-xs font-medium hover:bg-muted/80 transition-colors">
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

                    {/* Compact Sidebar */}
                    <aside className="space-y-4">
                        {/* Back to blog */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-sm group">
                            <ChevronLeft
                                className={cn(
                                    'h-4 w-4 group-hover:-translate-x-0.5 transition-transform',
                                    isRTL ? 'ml-1 order-last' : 'mr-1',
                                )}
                            />
                            <span>
                                {dict.blog?.backToBlog || 'Back to Blog'}
                            </span>
                        </Link>

                        {/* Compact Author box */}
                        <div className="bg-card rounded-lg shadow-sm border p-4">
                            <h3 className="text-sm font-semibold mb-3 text-foreground">
                                {dict.blog?.aboutAuthor || 'About the Author'}
                            </h3>
                            <div className="flex items-center">
                                <div
                                    className={cn(
                                        'w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900/50 flex items-center justify-center',
                                        isRTL ? 'ml-3' : 'mr-3',
                                    )}>
                                    <User className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div>
                                    <h4 className="font-medium text-foreground text-sm">
                                        {post.author}
                                    </h4>
                                </div>
                            </div>
                        </div>

                        {/* Compact Call to action */}
                        <div className="bg-gradient-to-br from-brand-500 to-brand-600 dark:from-brand-700 dark:to-brand-800 rounded-lg shadow-sm p-4 text-white">
                            <h3 className="text-sm font-semibold mb-2">
                                {dict.blog?.donateNow || 'Donate Blood Today'}
                            </h3>
                            <p className="mb-3 text-white/90 text-xs">
                                {dict.blog?.donateMessage ||
                                    'Your donation can save up to three lives. Find donation centers near you.'}
                            </p>
                            <Link
                                href="/campaigns"
                                className="inline-block bg-white text-brand-600 font-medium px-3 py-1.5 rounded text-xs hover:bg-white/95 transition-colors dark:text-brand-100 dark:bg-brand-500 dark:hover:bg-brand-400">
                                {dict.blog?.findCampaigns || 'Find Campaigns'}
                            </Link>
                        </div>

                        {/* Compact Related posts */}
                        {relatedPosts.length > 0 && (
                            <div className="bg-card rounded-lg shadow-sm border p-4">
                                <h3 className="text-sm font-semibold mb-3 text-foreground">
                                    {dict.blog?.relatedPosts || 'Related Posts'}
                                </h3>
                                <div className="space-y-3">
                                    {relatedPosts.slice(0, 3).map(post => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}
                                            className="block group">
                                            <div className="flex gap-3">
                                                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h4 className="font-medium text-foreground group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-sm line-clamp-2 leading-tight">
                                                        {post.title}
                                                    </h4>
                                                    <span className="text-muted-foreground text-xs">
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
