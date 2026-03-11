'use client';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
} from '@/components/ui/breadcrumb';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function BreadcrumbNav() {
    const pathname = usePathname();
    const segments = pathname.split('/').filter(segment => Boolean(segment));

    const dashboardIndex = segments.indexOf('dashboard');

    const paths =
        dashboardIndex === -1
            ? []
            : segments.slice(dashboardIndex + 1).filter(segment => {
                  if (!segment) return false;
                  if (/^\[.*\]$/.test(segment)) return false;
                  if (/^\d+$/.test(segment)) return false;
                  return true;
              });

    const formatLabel = (segment: string) =>
        segment
            .split('-')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join(' ');

    return (
        <div className="flex h-10 items-center bg-background px-6">
            <Breadcrumb className="flex items-center">
                <BreadcrumbItem>
                    <BreadcrumbLink
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors mr-3"
                        href="/dashboard"
                    >
                        <Home className="h-3.5 w-3.5" />
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {paths.map((path, index) => {
                    const href = `/dashboard/${paths
                        .slice(0, index + 1)
                        .join('/')}`;
                    const isLast = index === paths.length - 1;
                    const label = formatLabel(path);

                    return (
                        <BreadcrumbItem key={path}>
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-1.5" />
                            <BreadcrumbLink
                                href={href}
                                className={`text-xs transition-colors ${
                                    isLast
                                        ? 'font-semibold text-foreground'
                                        : 'text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                {label}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    );
                })}
            </Breadcrumb>
        </div>
    );
}
