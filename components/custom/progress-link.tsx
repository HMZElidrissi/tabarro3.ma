'use client';

import Link, { LinkProps } from 'next/link';
import { useLoadingBar } from './navigation-events';
import { usePathname } from 'next/navigation';

type ProgressLinkProps = LinkProps & {
    children: React.ReactNode;
    className?: string;
};

export const ProgressLink = ({
    children,
    href,
    className,
    ...rest
}: ProgressLinkProps) => {
    const { ref } = useLoadingBar();
    const pathname = usePathname();

    const handleClick = () => {
        if (pathname !== href) {
            ref?.current?.continuousStart();
        }
    };

    return (
        <Link href={href} onClick={handleClick} className={className} {...rest}>
            {children}
        </Link>
    );
};
