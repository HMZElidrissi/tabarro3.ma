import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

let firebaseApp: FirebaseApp | null = null;
let analyticsInstance: Analytics | null = null;

function getFirebaseConfig() {
    const config = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    } as const;

    return config;
}

export async function initializeFirebaseAnalytics(): Promise<Analytics | null> {
    if (typeof window === 'undefined') return null;
    if (process.env.NODE_ENV !== 'production') return null;

    if (!firebaseApp) {
        const cfg = getFirebaseConfig();
        // Require at minimum apiKey, appId; measurementId enables analytics
        if (!cfg.apiKey || !cfg.appId) return null;
        firebaseApp = initializeApp(cfg);
    }

    if (!analyticsInstance) {
        const supported = await isSupported().catch(() => false);
        if (!supported) return null;
        analyticsInstance = getAnalytics(firebaseApp!);
    }

    return analyticsInstance;
}
