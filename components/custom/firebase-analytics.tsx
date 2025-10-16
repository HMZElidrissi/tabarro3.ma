'use client';

import { useEffect } from 'react';
import { initializeFirebaseAnalytics } from '@/lib/firebase';

export function FirebaseAnalytics(): null {
    useEffect(() => {
        initializeFirebaseAnalytics().catch(() => {
            // Swallow analytics init errors silently in production
        });
    }, []);

    return null;
}
