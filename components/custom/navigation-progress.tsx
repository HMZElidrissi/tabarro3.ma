'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import LoadingBar, { type LoadingBarRef } from 'react-top-loading-bar';

export function NavigationProgress() {
    const ref = useRef<LoadingBarRef>(null);
    const pathname = usePathname();

    useEffect(() => {
        if (ref.current) {
            ref.current.complete();
        }
    }, [pathname]);

    useEffect(() => {
        // This is a workaround to show the loading bar on initial load
        // and when the component mounts.
        if (ref.current) {
            ref.current.continuousStart();
        }
    }, []);

    return <LoadingBar color="#f54748" ref={ref} shadow={true} height={3} />;
}
