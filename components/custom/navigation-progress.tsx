'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { useLoadingBar } from './navigation-events';

export function NavigationProgress() {
    const { ref } = useLoadingBar();
    const pathname = usePathname();

    useEffect(() => {
        if (ref?.current) {
            ref.current.complete();
        }
    }, [pathname, ref]);

    return <LoadingBar color="#f54748" ref={ref} shadow={true} height={3} />;
}
