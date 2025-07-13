import {
    Building2Icon,
    Calendar1Icon,
    Droplets,
    Home,
    Mail,
    Settings,
    UsersIcon,
} from 'lucide-react';
import { Role } from '@/types/enums';

export interface NavigationItem {
    title: string;
    icon: React.ElementType;
    href: string;
    roles?: Role[];
    badge?: string;
    pattern?: string;
}

export const mainNavigation: NavigationItem[] = [
    {
        title: 'Home',
        icon: Home,
        href: '/dashboard',
        pattern: '^/dashboard$',
        roles: [Role.ADMIN, Role.ORGANIZATION],
    },
    {
        title: 'Participants',
        icon: UsersIcon,
        href: '/dashboard/participants',
        pattern: '^/dashboard/participants',
        roles: [Role.ADMIN],
    },
    {
        title: 'Requests',
        icon: Droplets,
        href: '/dashboard/requests',
        pattern: '^/dashboard/requests',
        roles: [Role.ADMIN],
    },
    {
        title: 'Organizations',
        icon: Building2Icon,
        href: '/dashboard/organizations',
        pattern: '^/dashboard/organizations',
        roles: [Role.ADMIN],
    },
    {
        title: 'Campaigns',
        icon: Calendar1Icon,
        href: '/dashboard/campaigns',
        pattern: '^/dashboard/campaigns',
        roles: [Role.ADMIN, Role.ORGANIZATION],
    },
    {
        title: 'Email Composer',
        icon: Mail,
        href: '/dashboard/emails',
        pattern: '^/dashboard/emails',
        roles: [Role.ADMIN, Role.ORGANIZATION],
    },
];

export const secondaryNavigation: NavigationItem[] = [
    {
        title: 'Settings',
        icon: Settings,
        href: '/dashboard/settings',
        pattern: '^/dashboard/settings',
    },
];
