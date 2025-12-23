'use client';

import {
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ProgressLink as Link } from '@/components/custom/progress-link';
import { NavigationItem } from '@/config/dashboard';

interface NavItemProps {
    item: NavigationItem;
}

export default function NavItem({ item }: NavItemProps) {
    const pathname = usePathname();
    const { isMobile, setOpenMobile } = useSidebar();

    // Check if the current path matches either the exact href or the pattern
    const isActive = item.pattern
        ? new RegExp(item.pattern).test(pathname)
        : pathname === item.href;

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={cn(
                    'p-5 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors relative',
                    isActive && 'bg-gray-100 dark:bg-gray-800 text-primary',
                )}
            >
                <Link
                    href={item.href}
                    className="flex items-center gap-3"
                    onClick={() => {
                        if (isMobile) setOpenMobile(false);
                    }}
                >
                    <item.icon
                        className={cn(
                            'h-4 w-4',
                            isActive
                                ? 'text-primary'
                                : 'text-gray-500 dark:text-gray-400',
                        )}
                    />
                    <span
                        className={cn(
                            'font-medium',
                            isActive
                                ? 'text-primary'
                                : 'text-gray-700 dark:text-gray-300',
                        )}
                    >
                        {item.title}
                    </span>
                    {item.badge && (
                        <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            {item.badge}
                        </span>
                    )}
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
