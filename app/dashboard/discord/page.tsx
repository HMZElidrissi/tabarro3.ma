import { DashboardShell } from '@/components/dashboard/shell';
import { DiscordSettings } from '@/components/dashboard/discord-settings';

export default function DiscordPage() {
    return (
        <DashboardShell
            header="Discord Settings"
            description="Manage Discord webhook integration and notifications for your blood donation platform."
        >
            <DiscordSettings />
        </DashboardShell>
    );
}
