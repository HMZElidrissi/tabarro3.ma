import { MetadataRoute } from 'next';
import { getBlogPosts } from '@/lib/notion';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tabarro3.ma';

    const posts = await getBlogPosts();

    const postsRoutes = posts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.publishDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const routes = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/eligibility`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/campaigns`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/requests`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
    ];

    return [...routes, ...postsRoutes];
}
