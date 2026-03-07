import { SignJWT, jwtVerify, JWTPayload } from 'jose';

const key = new TextEncoder().encode(process.env.AUTH_SECRET);

export type UnsubscribeCategory = 'CAMPAIGN_DIGEST' | 'BLOOD_REQUEST';

export interface UnsubscribePayload extends JWTPayload {
    email: string;
    type: UnsubscribeCategory;
}

export async function createUnsubscribeToken(
    email: string,
    type: UnsubscribeCategory,
): Promise<string> {
    if (!process.env.AUTH_SECRET) {
        throw new Error('AUTH_SECRET is not configured');
    }

    return await new SignJWT({ email, type })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        // Unsubscribe links should be long-lived
        .setExpirationTime('10y')
        .sign(key);
}

export async function verifyUnsubscribeToken(
    token: string,
): Promise<UnsubscribePayload | null> {
    if (!process.env.AUTH_SECRET) {
        console.error('AUTH_SECRET is not configured');
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, key, {
            algorithms: ['HS256'],
        });
        const { email, type } = payload as UnsubscribePayload;

        if (
            !email ||
            !type ||
            (type !== 'CAMPAIGN_DIGEST' && type !== 'BLOOD_REQUEST')
        ) {
            return null;
        }

        return { email, type };
    } catch (error) {
        console.error('Invalid unsubscribe token:', error);
        return null;
    }
}

export function getUnsubscribeUrl(token: string): string {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
    return `${baseUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
}

