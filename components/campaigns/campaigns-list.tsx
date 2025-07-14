import { CampaignCard } from '@/components/campaigns/campaign-card';
import { Campaign } from '@/types/campaign';

interface CampaignsListProps {
    campaigns: Campaign[];
    authenticated: boolean;
    userId?: string;
    dict: any;
}

export default function CampaignsList({
    campaigns,
    authenticated,
    userId,
    dict,
}: CampaignsListProps) {
    const ongoingCampaigns = campaigns.filter(
        campaign =>
            new Date(campaign.startTime) <= new Date() &&
            new Date(campaign.endTime) >= new Date(),
    );

    const upcomingCampaigns = campaigns.filter(
        campaign => new Date(campaign.startTime) > new Date(),
    );

    const pastCampaigns = campaigns.filter(
        campaign => new Date(campaign.endTime) < new Date(),
    );

    return (
        <div className="container mx-auto py-8">
            <div className="space-y-12">
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-10">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-brand-600"
                        >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                        {dict.New_Campaigns}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {dict.New_Campaigns_Description}
                    </p>

                    <div className="mt-8 w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>
                </div>

                {ongoingCampaigns.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">
                            {dict.Ongoing_Campaigns}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ongoingCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    authenticated={authenticated}
                                    userId={userId}
                                    dict={dict}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {upcomingCampaigns.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">
                            {dict.Upcoming_Campaigns}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {upcomingCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    authenticated={authenticated}
                                    userId={userId}
                                    dict={dict}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {pastCampaigns.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold">
                            {dict.Past_Campaigns}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pastCampaigns.map(campaign => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                    authenticated={authenticated}
                                    userId={userId}
                                    dict={dict}
                                    passed={true}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {campaigns.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            {dict.No_campaigns_found}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
