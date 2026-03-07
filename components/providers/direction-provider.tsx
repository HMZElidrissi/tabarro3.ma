'use client';

import { DirectionProvider } from '@/components/ui/direction';

type Direction = 'ltr' | 'rtl';

export function DirectionProviderWrapper({
    dir,
    children,
}: {
    dir: Direction;
    children: React.ReactNode;
}) {
    return <DirectionProvider dir={dir}>{children}</DirectionProvider>;
}
