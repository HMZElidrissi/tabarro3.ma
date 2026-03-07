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
        <Breadcrumb className="flex items-center">
            <BreadcrumbItem>
                <BreadcrumbLink
                    className="flex items-center text-gray-400 hover:text-gray-500 mr-3"
                    href="/dashboard"
                >
                    <Home className="h-4 w-4" />
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
                        <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                        <BreadcrumbLink
                            href={href}
                            className={`text-gray-500 hover:text-gray-700 ${isLast ? 'font-semibold' : ''}`}
                        >
                            {label}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                );
            })}
        </Breadcrumb>
    );
}
