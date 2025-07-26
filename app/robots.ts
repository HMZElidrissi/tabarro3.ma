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
                    '/blog/*',
                    '/eligibility',
                    '/about',
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
                    '/profile/requests/*',
                    '/_next/*',
                    '/static/*',
                    '/_vercel/*',
                    '/api/send-email',
                    '/api/blog-image/*',
                    '/api/og/*',
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
