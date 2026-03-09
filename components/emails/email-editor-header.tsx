'use client';

import Link from 'next/link';
import { ChevronRight, LayoutDashboard, Mail } from 'lucide-react';

export default function EmailEditorHeader() {
    return (
        <div className="bg-white dark:bg-background border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <div className="container mx-auto px-6 py-3">
                <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Admin</span>
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                        <Mail className="w-3.5 h-3.5 text-red-600" />
                        <span>Email Management</span>
                    </div>
                </nav>
            </div>
        </div>
    );
}
