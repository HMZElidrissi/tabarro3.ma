import { DashboardShell } from '@/components/dashboard/shell';
import { DashboardStats } from '@/components/dashboard/stats';
import { DashboardExport } from '@/components/dashboard/export';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { getUser } from '@/auth/session';
import {
    getDashboardStats,
    getParticipantsPerCity,
    getParticipantsPerRegion,
    getRecentParticipants,
} from '@/actions/dashboard';
import { Overview } from '@/components/dashboard/overview';
import { RegionChart } from '@/components/dashboard/region-chart';
import { RecentParticipants } from '@/components/dashboard/recent-participants';
import { Role } from '@/types/enums';
import { User } from '@/types/user';

export default async function DashboardPage() {
    const user = await getUser();
    if (!user) return null;
    const role = user.role as Role;

    const [
        stats,
        recentParticipants,
        participantsPerCity,
        participantsPerRegion,
    ] = await Promise.all([
        getDashboardStats(user.id, role),
        getRecentParticipants(),
        getParticipantsPerCity(user.id, role),
        getParticipantsPerRegion(user.id, role),
    ]);

    return (
        <DashboardShell
            header="Dashboard"
            toolbar={<DashboardExport userRole={role} />}
        >
            <DashboardStats userRole={role} stats={stats as any} />

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card className="md:col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Participants by City</CardTitle>
                        <CardDescription>
                            Top cities with most participants
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Overview data={participantsPerCity} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Participants by Region</CardTitle>
                        <CardDescription>
                            Regional distribution of participants
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <RegionChart data={participantsPerRegion} />
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Participants</CardTitle>
                        <CardDescription>
                            Latest platform participants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RecentParticipants
                            participants={recentParticipants as User[]}
                        />
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
