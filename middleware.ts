import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { verifyToken } from '@/auth/session';
import { i18n, isValidLocale } from '@/i18n/i18n-config';

const guestRoutes = [
    '/sign-in',
    '/sign-up',
    '/accept-invitation',
    '/forgot-password',
    '/reset-password',
];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isDashboard = pathname.startsWith('/dashboard');
    const isHandbook = pathname.startsWith('/handbook');

    // Handle authentication
    const sessionCookie = request.cookies.get('session')?.value;
    const session = sessionCookie ? await verifyToken(sessionCookie) : null;
    const isAuthenticated = !!session && new Date(session.expires) > new Date();

    if (isAuthenticated && guestRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isAuthenticated && isDashboard) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    // Create response
    const response = NextResponse.next();

    // If accessing dashboard, force set locale to 'fr'
    if (isDashboard || isHandbook) {
        response.cookies.set('NEXT_LOCALE', 'fr', {
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });
        response.headers.set('x-locale', 'fr');
    } else {
        // Handle i18n for non-dashboard routes
        let locale = request.cookies.get('NEXT_LOCALE')?.value;

        // If no cookie exists or invalid locale, set to default
        if (!isValidLocale(locale)) {
            locale = i18n.defaultLocale;
        }

        // Set or update locale cookie
        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
        });

        // Add locale to headers for server components
        response.headers.set('x-locale', locale);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all routes except:
         * 1. /api (API routes)
         * 2. /_next (Next.js internals)
         * 3. /static (static files)
         * 4. /_vercel (Vercel internals)
         * 5. /favicon.ico, /robots.txt (static files)
         */
        '/((?!api|_next|static|_vercel|favicon.ico|robots.txt).*)',
    ],
};
