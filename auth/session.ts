import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import type { User } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);
const SALT_ROUNDS = 10;

type SessionData = {
    userId: string;
    expires: string;
};

export async function hashPassword(password: string) {
    const salt = genSaltSync(SALT_ROUNDS);
    return hashSync(password, salt);
}

export function comparePasswords(
    plainTextPassword: string,
    hashedPassword: string,
): boolean {
    return compareSync(plainTextPassword, hashedPassword);
}

export async function signToken(payload: SessionData) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1 day from now')
        .sign(key);
}

export async function verifyToken(input: string) {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload as SessionData;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const session = (await cookies()).get('session')?.value;
    if (!session) return null;

    const payload = await verifyToken(session);
    if (!payload) return null;

    // Check if session has expired
    if (new Date(payload.expires) < new Date()) {
        await deleteSession();
        return null;
    }

    return payload;
}

export async function getUser(): Promise<User | null> {
    const session = await getSession();
    if (!session) return null;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: session.userId,
                deletedAt: null, // Only get active users
            },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                createdAt: true,
                updatedAt: true,
                notificationLanguage: true,
            },
        });

        return user as User;
    } catch (error) {
        console.error('Error fetching user:', error);
        return null;
    }
}

export async function setSession(user: User) {
    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const session: SessionData = {
        userId: user.id,
        expires: expiresInOneDay.toISOString(),
    };

    const encryptedSession = await signToken(session);

    // Set cookie with edge-compatible options
    const cookieStore = await cookies();
    cookieStore.set('session', encryptedSession, {
        expires: expiresInOneDay,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
}

// Utility function to validate session in API routes
export async function validateSession(request: Request): Promise<User | null> {
    const sessionCookie = request.headers
        .get('cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('session='))
        ?.split('=')[1];

    if (!sessionCookie) return null;

    const session = await verifyToken(sessionCookie);
    if (!session) return null;

    return getUser();
}

// Utility function for API route protection
export function withAuth(handler: Function) {
    return async (request: Request) => {
        const user = await validateSession(request);
        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return handler(request, user);
    };
}
