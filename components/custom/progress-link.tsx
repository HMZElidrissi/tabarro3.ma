'use client';

import Link, { LinkProps } from 'next/link';
import { useLoadingBar } from './navigation-events';
import { usePathname } from 'next/navigation';

type ProgressLinkProps = LinkProps & {
    children: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const ProgressLink = ({
    children,
    href,
    className,
    onClick,
    ...rest
}: ProgressLinkProps) => {
    const { ref } = useLoadingBar();
    const pathname = usePathname();

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Call any consumer-provided onClick first
        onClick?.(e);
        if (e.defaultPrevented) return;
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
