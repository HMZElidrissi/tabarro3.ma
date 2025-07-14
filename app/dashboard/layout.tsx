import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';
import { ThemeProvider } from 'next-themes';
import { UserProvider } from '@/auth';
import { getUser } from '@/auth/session';
import { Toaster } from '@/components/ui/toaster';
import { redirect } from 'next/navigation';
import { Role } from '@/types/enums';

export const metadata = {
    title: 'Dashboard',
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    let userPromise = getUser();

    const user = await userPromise;
    if (user?.role === Role.PARTICIPANT) {
        redirect('/profile');
    }

    return (
        <UserProvider userPromise={userPromise}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                storageKey="theme"
            >
                <SidebarProvider>
                    <div className="w-full flex h-screen overflow-x-auto">
                        <DashboardSidebar />
                        <SidebarInset className="flex flex-col w-full">
                            <DashboardHeader />
                            <div className="w-full flex-1 p-4 overflow-x-auto">
                                <Toaster />
                                {children}
                            </div>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </ThemeProvider>
        </UserProvider>
    );
}
