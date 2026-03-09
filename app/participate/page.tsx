import { getCampaign } from '@/actions/campaign';
import { notFound, redirect } from 'next/navigation';
import { getUser } from '@/auth/session';
import { ParticipateForm } from '@/components/campaigns/participate-form';
import { Metadata } from 'next';
import { Campaign } from '@/types/campaign';
import { MapPin, Calendar, Building2, User, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import Link from 'next/link';
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();

    return {
        title: dict.New_Campaigns,
        description: dict.New_Campaigns_Description,
    };
}

export default async function ParticipatePage({
    searchParams,
}: {
    searchParams: Promise<{ campaignId: string }>;
}) {
    const dict = await getDictionary();
    const locale = await getLocale();
    const isRTL = locale === 'ar';
    const { campaignId } = await searchParams;
    const user = await getUser();

    if (!campaignId) {
        notFound();
    }

    const campaignIdNum = Number(campaignId);
    if (isNaN(campaignIdNum)) {
        notFound();
    }

    const campaignData = await getCampaign(campaignIdNum);
    if (campaignData === null) {
        notFound();
    }

    // Type cast to Campaign
    const campaign = campaignData as unknown as Campaign;

    // If user is already authenticated, redirect to campaigns page
    if (user) {
        redirect('/campaigns');
    }

    // Calculate campaign status
    const isUpcoming = new Date(campaign.startTime) > new Date();
    const isPast = new Date(campaign.endTime) < new Date();
    const isOngoing =
        new Date(campaign.startTime) <= new Date() &&
        new Date(campaign.endTime) >= new Date();

    const getStatusBadge = () => {
        if (isOngoing) {
            return {
                text: dict.Ongoing,
                className:
                    'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/50 dark:text-green-400 dark:border-green-800',
            };
        }
        if (isUpcoming) {
            return {
                text: dict.Upcoming,
                className:
                    'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/50 dark:text-blue-400 dark:border-blue-800',
            };
        }
        return {
            text: dict.Past,
            className: 'bg-muted text-muted-foreground border-border',
        };
    };

    const statusBadge = getStatusBadge();

    return (
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                <Link href="/" className="flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="tabarro3"
                        width={150}
                        height={150}
                    />
                </Link>
                {/* <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">
                        {dict.participate.title}
                    </h1>
                    <p className="text-muted-foreground">
                        {dict.participate.description}
                    </p>
                </div> */}

                <Card className="group h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
                    <CardContent className="flex-1 p-2">
                        {/* Header with status badge */}
                        <div className="flex items-start justify-between mb-4 gap-2">
                            <Badge
                                variant="outline"
                                className={cn(
                                    'text-xs font-medium px-2 py-1 shrink-0',
                                    statusBadge.className,
                                )}
                            >
                                <Clock className="w-3 h-3 me-1" />
                                {statusBadge.text}
                            </Badge>
                        </div>

                        {/* Campaign Title */}
                        <h2 className="font-semibold text-foreground mb-4 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors text-xl">
                            {campaign.name}
                        </h2>

                        {/* Campaign Details */}
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                                <span className="truncate">
                                    {campaign.organization?.name ||
                                        dict.common.unknown}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                                <span className="truncate">
                                    {campaign.location}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Building2 className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                                <span className="truncate">
                                    {campaign.city?.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                                <span className="truncate">
                                    {format(campaign.startTime, 'dd/MM/yy')} -{' '}
                                    {format(campaign.endTime, 'dd/MM/yy')}
                                </span>
                            </div>

                            {campaign.organization?.phone && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Phone className="h-4 w-4 text-muted-foreground/80 shrink-0" />
                                    <span className="truncate">
                                        {campaign.organization.phone}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {campaign.description && (
                            <p className="text-sm text-muted-foreground mt-5 pt-4 border-t border-border">
                                {campaign.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <ParticipateForm
                    campaign={campaign}
                    dict={dict}
                    isRTL={isRTL}
                />
            </div>
        </div>
    );
}
