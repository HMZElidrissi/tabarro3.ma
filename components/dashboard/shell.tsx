import { BreadcrumbNav } from '@/components/dashboard/breadcrumb-nav';

interface DashboardShellProps {
    children: React.ReactNode;
    header?: string;
    description?: string;
    toolbar?: React.ReactNode;
}

export function DashboardShell({
    children,
    header,
    description,
    toolbar,
}: DashboardShellProps) {
    return (
        <div className="w-full flex-1 space-y-4">
            <BreadcrumbNav />

            <div className="p-8 pt-2 space-y-4">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        {header && (
                            <h2 className="text-3xl font-bold tracking-tight">
                                {header}
                            </h2>
                        )}
                        {description && (
                            <p className="text-muted-foreground">{description}</p>
                        )}
                    </div>
                    {toolbar}
                </div>
                {children}
            </div>
        </div>
    );
}
