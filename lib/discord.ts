import { BloodRequest } from '@/types/blood-request';
import { Campaign } from '@/types/campaign';
import { User } from '@/types/user';
import { BloodGroup } from '@/types/enums';

interface DiscordEmbed {
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    footer?: {
        text: string;
    };
    timestamp?: string;
    thumbnail?: {
        url: string;
    };
}

interface DiscordWebhookPayload {
    content?: string;
    embeds?: DiscordEmbed[];
    username?: string;
    avatar_url?: string;
}

export class DiscordService {
    private webhookUrl: string;
    private baseUrl: string;
    private defaultUsername?: string;
    private defaultAvatarUrl?: string;

    constructor() {
        this.webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
        this.baseUrl = 'https://tabarro3.ma';
        this.defaultUsername = 'tabarro3.ma';
        this.defaultAvatarUrl = `${this.baseUrl}/logo.png`;
    }

    private async sendWebhook(
        payload: DiscordWebhookPayload,
    ): Promise<boolean> {
        if (!this.webhookUrl) {
            console.warn('Discord webhook URL not configured');
            return false;
        }

        try {
            const response = await fetch(this.webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: payload.username ?? this.defaultUsername,
                    avatar_url: this.defaultAvatarUrl,
                    content: payload.content,
                    embeds: payload.embeds,
                }),
            });

            if (!response.ok) {
                console.error(
                    'Discord webhook failed:',
                    response.status,
                    response.statusText,
                );
                return false;
            }

            console.log('Discord notification sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending Discord notification:', error);
            return false;
        }
    }

    private getBloodGroupEmoji(bloodGroup: BloodGroup): string {
        const emojiMap: Record<BloodGroup, string> = {
            [BloodGroup.A_POSITIVE]: '🅰️',
            [BloodGroup.A_NEGATIVE]: '🅰️',
            [BloodGroup.B_POSITIVE]: '🅱️',
            [BloodGroup.B_NEGATIVE]: '🅱️',
            [BloodGroup.O_POSITIVE]: '🅾️',
            [BloodGroup.O_NEGATIVE]: '🅾️',
            [BloodGroup.AB_POSITIVE]: '🆎',
            [BloodGroup.AB_NEGATIVE]: '🆎',
            [BloodGroup.UNKNOWN]: '❓',
        };
        return emojiMap[bloodGroup] || '❓';
    }

    private formatBloodGroup(bloodGroup: BloodGroup): string {
        return bloodGroup.replace('_', '+').replace('_', '-');
    }

    async sendUrgentBloodRequestNotification(
        request: BloodRequest,
    ): Promise<boolean> {
        const embed: DiscordEmbed = {
            title: '🩸 Demande de sang urgente',
            description: `**${request.description}**`,
            color: 0xff0000,
            fields: [
                {
                    name: '🏥 Groupe sanguin',
                    value: `${this.getBloodGroupEmoji(request.bloodGroup)} ${this.formatBloodGroup(request.bloodGroup)}`,
                    inline: true,
                },
                {
                    name: '📍 Localisation',
                    value: `${request.city.name} - ${request.location}`,
                    inline: true,
                },
                {
                    name: '📞 Contact',
                    value: request.phone,
                    inline: true,
                },
                {
                    name: '👤 Demandeur',
                    value: request.user?.name || 'Anonyme',
                    inline: true,
                },
                {
                    name: '⏰ Date de demande',
                    value: `<t:${Math.floor(request.createdAt.getTime() / 1000)}:F>`,
                    inline: true,
                },
            ],
            footer: {
                text: 'tabarro3.ma - Plateforme de don de sang',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: `🚨 **DEMANDE DE SANG URGENTE** - ${request.city.name}`,
            embeds: [embed],
            username: 'tabarro3.ma - Urgences',
        };

        return this.sendWebhook(payload);
    }

    async sendNewCampaignNotification(campaign: Campaign): Promise<boolean> {
        const embed: DiscordEmbed = {
            title: '🎯 Nouvelle campagne de don de sang',
            description: `**${campaign.name}**`,
            color: 0x00ff00,
            fields: [
                {
                    name: '📝 Description',
                    value: campaign.description,
                    inline: false,
                },
                {
                    name: '📍 Localisation',
                    value: `${campaign.city?.name || 'Non spécifié'} - ${campaign.location}`,
                    inline: true,
                },
                {
                    name: '🏢 Organisation',
                    value: campaign.organization?.name || 'Non spécifiée',
                    inline: true,
                },
                {
                    name: '⏰ Début',
                    value: `<t:${Math.floor(campaign.startTime.getTime() / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '⏰ Fin',
                    value: `<t:${Math.floor(campaign.endTime.getTime() / 1000)}:F>`,
                    inline: true,
                },
                {
                    name: '👥 Participants',
                    value: `${campaign.participants?.length || 0} inscrits`,
                    inline: true,
                },
            ],
            footer: {
                text: 'tabarro3.ma - Plateforme de don de sang',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: `🎯 **NOUVELLE CAMPAGNE** - ${campaign.city?.name || 'Maroc'}`,
            embeds: [embed],
            username: 'tabarro3.ma - Campagnes',
        };

        return this.sendWebhook(payload);
    }

    async sendUserRegistrationNotification(user: User): Promise<boolean> {
        const embed: DiscordEmbed = {
            title: '👤 Nouvel utilisateur inscrit',
            description: `**${user.name}** s'est inscrit sur la plateforme`,
            color: 0x0099ff,
            fields: [
                {
                    name: '📧 Email',
                    value: user.email,
                    inline: true,
                },
                {
                    name: '📱 Téléphone',
                    value: user.phone || 'Non renseigné',
                    inline: true,
                },
                {
                    name: '🩸 Groupe sanguin',
                    value: user.bloodGroup
                        ? `${this.getBloodGroupEmoji(user.bloodGroup)} ${this.formatBloodGroup(user.bloodGroup)}`
                        : 'Non renseigné',
                    inline: true,
                },
                {
                    name: '📍 Ville',
                    value: user.city?.name || 'Non renseignée',
                    inline: true,
                },
                {
                    name: '⏰ Date d inscription',
                    value: `<t:${Math.floor(user.createdAt.getTime() / 1000)}:F>`,
                    inline: true,
                },
            ],
            footer: {
                text: 'tabarro3.ma - Plateforme de don de sang',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: `👤 **NOUVEL UTILISATEUR** - ${user.name}`,
            embeds: [embed],
            username: 'tabarro3.ma - Utilisateurs',
        };

        return this.sendWebhook(payload);
    }

    async sendSystemNotification(
        title: string,
        message: string,
        type: 'info' | 'warning' | 'error' = 'info',
    ): Promise<boolean> {
        const colorMap = {
            info: 0x0099ff,
            warning: 0xffaa00,
            error: 0xff0000,
        };

        const emojiMap = {
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌',
        };

        const embed: DiscordEmbed = {
            title: `${emojiMap[type]} ${title}`,
            description: message,
            color: colorMap[type],
            footer: {
                text: 'tabarro3.ma - Système',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: `${emojiMap[type]} **${title.toUpperCase()}**`,
            embeds: [embed],
            username: 'tabarro3.ma - Système',
        };

        return this.sendWebhook(payload);
    }

    async sendWeeklyStatistics(stats: {
        totalParticipants: number;
        totalCampaigns: number;
        totalBloodRequests: number;
        newParticipantsThisWeek: number;
        newCampaignsThisWeek: number;
        urgentRequestsThisWeek: number;
    }): Promise<boolean> {
        const embed: DiscordEmbed = {
            title: '📊 Statistiques hebdomadaires',
            description: 'Résumé des activités de la semaine',
            color: 0x9932cc,
            fields: [
                {
                    name: '👥 Participants totaux',
                    value: stats.totalParticipants.toString(),
                    inline: true,
                },
                {
                    name: '🆕 Nouveaux participants',
                    value: stats.newParticipantsThisWeek.toString(),
                    inline: true,
                },
                {
                    name: '🎯 Campagnes totales',
                    value: stats.totalCampaigns.toString(),
                    inline: true,
                },
                {
                    name: '🆕 Nouvelles campagnes',
                    value: stats.newCampaignsThisWeek.toString(),
                    inline: true,
                },
                {
                    name: '🩸 Demandes totales',
                    value: stats.totalBloodRequests.toString(),
                    inline: true,
                },
                {
                    name: '🚨 Demandes urgentes',
                    value: stats.urgentRequestsThisWeek.toString(),
                    inline: true,
                },
            ],
            footer: {
                text: 'tabarro3.ma - Statistiques hebdomadaires',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: '📊 **STATISTIQUES HEBDOMADAIRES**',
            embeds: [embed],
            username: 'tabarro3.ma - Statistiques',
        };

        return this.sendWebhook(payload);
    }

    async testWebhook(): Promise<boolean> {
        const embed: DiscordEmbed = {
            title: '🧪 Test de webhook Discord',
            description:
                'Ce message confirme que la configuration Discord fonctionne correctement.',
            color: 0x00ff00,
            fields: [
                {
                    name: '✅ Statut',
                    value: 'Webhook configuré et fonctionnel',
                    inline: true,
                },
                {
                    name: '⏰ Test effectué le',
                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
                    inline: true,
                },
            ],
            footer: {
                text: 'tabarro3.ma - Test de configuration',
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
                url: `${this.baseUrl}/logo.png`,
            },
        };

        const payload: DiscordWebhookPayload = {
            content: '🧪 **TEST DE WEBHOOK DISCORD**',
            embeds: [embed],
            username: 'tabarro3.ma - Test',
        };

        return this.sendWebhook(payload);
    }

    isConfigured(): boolean {
        return !!this.webhookUrl;
    }
}

// Export singleton instance
export const discordService = new DiscordService();
