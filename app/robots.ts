import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/campaigns',
                    '/requests',
                    '/blog',
                    '/blog/*',
                    '/eligibility',
                    '/about',
                    '/participate',
                ],
                disallow: [
                    '/api/jobs/*',
                    '/dashboard/*',
                    '/api/og/*',
                    '/api/discord/*',
                    '/handbook',
                    '/sign-in',
                    '/sign-up',
                    '/accept-invitation',
                    '/reset-password',
                    '/forgot-password',
                    '/profile',
                    '/unsubscribe',
                    '/_next/*',
                    '/static/*',
                    '/_vercel/*',
                ],
            },
            {
                userAgent: 'Googlebot',
                allow: ['/'],
                crawlDelay: 1,
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
