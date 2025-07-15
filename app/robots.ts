import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://tabarro3.ma';

    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/campaigns',
                    '/requests',
                    '/blog',
                    '/campaigns/add',
                    '/requests/add',
                ],
                disallow: [
                    '/api/jobs/*',
                    '/dashboard/*',
                    '/signin',
                    '/signup',
                    '/accept-invitation',
                    '/reset-password',
                    '/forgot-password',
                    '/profile',
                    '/_next/*',
                    '/static/*',
                    '/_vercel/*',
                    '/api/send-email',
                    '/api/og-image/*',
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
