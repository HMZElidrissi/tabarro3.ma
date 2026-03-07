'use server';

import { getUser } from '@/auth/session';
import { render } from '@react-email/components';
import { CustomEmail } from '@/emails/custom-email';
import { CampaignDigestEmail } from '@/emails/campaign-digest';
import { UrgentBloodRequestEmail } from '@/emails/urgent-blood-request';
import { sendEmail } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import { createUnsubscribeToken, getUnsubscribeUrl } from '@/lib/unsubscribe';
import { REGIONS_AND_CITIES } from '@/config/locations';
import { getBloodGroupLabel } from '@/config/blood-group';
import { BloodGroup } from '@/types/enums';

interface EmailData {
    showLogo: boolean;
    logoUrl: string;
    logoWidth: number;
    title: string;
    greeting: string;
    message: string;
    showHighlight: boolean;
    highlightTitle: string;
    highlightContent: string;
    highlightIcon: string;
    primaryButton: {
        enabled: boolean;
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };
    secondaryButton: {
        enabled: boolean;
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };
    additionalContent: string;
    showSignature: boolean;
    signature: string;
    showFooter: boolean;
    footerText: string;
    showCopyright: boolean;
    customFooterLinks: Array<{ text: string; url: string }>;
    recipientEmail: string;
    subject: string;
}

export async function sendCustomEmail(emailData: EmailData) {
    try {
        // Check if user is authenticated and has permission
        const user = await getUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
            return {
                success: false,
                error: 'Non autorisé. Seuls les administrateurs et organisations peuvent envoyer des emails.',
            };
        }

        // Validate required fields
        if (!emailData.recipientEmail || !emailData.subject) {
            return {
                success: false,
                error: 'Email du destinataire et sujet sont requis.',
            };
        }

        // Render the email template
        const template = CustomEmail({
            showLogo: emailData.showLogo,
            logoUrl: emailData.logoUrl,
            logoWidth: emailData.logoWidth,
            title: emailData.title,
            greeting: emailData.greeting,
            message: emailData.message,
            showHighlight: emailData.showHighlight,
            highlightTitle: emailData.highlightTitle,
            highlightContent: emailData.highlightContent,
            highlightIcon: emailData.highlightIcon,
            primaryButton: emailData.primaryButton.enabled
                ? {
                      text: emailData.primaryButton.text,
                      url: emailData.primaryButton.url,
                      style: emailData.primaryButton.style,
                  }
                : undefined,
            secondaryButton: emailData.secondaryButton.enabled
                ? {
                      text: emailData.secondaryButton.text,
                      url: emailData.secondaryButton.url,
                      style: emailData.secondaryButton.style,
                  }
                : undefined,
            additionalContent: emailData.additionalContent,
            showSignature: emailData.showSignature,
            signature: emailData.signature,
            showFooter: emailData.showFooter,
            footerText: emailData.footerText,
            showCopyright: emailData.showCopyright,
            customFooterLinks: emailData.customFooterLinks,
        });

        const emailHtml = await render(template, { pretty: true });
        const emailText = await render(template, { plainText: true });

        // Send the email via the shared sendEmail helper (Resend → nodemailer fallback)
        await sendEmail(
            emailData.recipientEmail,
            emailData.subject,
            emailHtml,
            emailText,
        );

        return {
            success: true,
            message: 'Email envoyé avec succès!',
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            success: false,
            error: "Erreur lors de l'envoi de l'email. Veuillez réessayer.",
        };
    }
}

// ─── Digest template test (uses real /emails/campaign-digest.tsx) ─────────

export type DigestTestTemplate = 'custom' | 'digest' | 'blood_request';

const SAMPLE_CAMPAIGNS = [
    {
        id: 1,
        name: 'Collecte de sang – Centre de santé',
        description:
            'Collecte exceptionnelle pour renforcer les réserves. Venez nombreux.',
        location: 'Centre de santé principal, salle des dons',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        organization: { name: 'Croissant-Rouge' },
        city: { name: 'Rabat' },
    },
    {
        id: 2,
        name: 'Don du sang – Hôpital régional',
        description: 'Journée portes ouvertes pour les donneurs de sang.',
        location: 'Hôpital Ibn Sina, bâtiment B',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        organization: { name: 'Centre hospitalier' },
        city: { name: 'Salé' },
    },
];

export async function getRegionsForDigest() {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
        return { error: 'Non autorisé', regions: [] };
    }
    return {
        regions: REGIONS_AND_CITIES.map(r => ({ id: r.id, name: r.name })),
    };
}

export async function getDigestTestData(regionId: number, useRealData: boolean) {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
        return { error: 'Non autorisé', regionName: null, campaigns: [] };
    }

    const region = REGIONS_AND_CITIES.find(r => r.id === regionId);
    const regionName = region?.name ?? 'Région';

    if (!useRealData) {
        return {
            regionName,
            campaigns: SAMPLE_CAMPAIGNS,
            date: new Date().toISOString().split('T')[0],
        };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const campaigns = await prisma.campaign.findMany({
        where: {
            city: { regionId },
            startTime: { lt: tomorrow },
            endTime: { gt: today },
        },
        include: {
            organization: { select: { name: true } },
            city: { select: { name: true } },
        },
        orderBy: { startTime: 'asc' },
        take: 20,
    });

    const campaignsForEmail = campaigns.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
        location: c.location,
        startTime: c.startTime.toISOString(),
        endTime: c.endTime.toISOString(),
        organization: { name: c.organization.name },
        city: { name: c.city.name },
    }));

    return {
        regionName,
        campaigns: campaignsForEmail,
        date: today.toISOString().split('T')[0],
    };
}

export async function getDigestPreviewHtml(regionId: number, useRealData: boolean) {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
        return { error: 'Non autorisé', html: null };
    }

    const data = await getDigestTestData(regionId, useRealData);
    if (data.error && !data.regionName) {
        return { error: data.error, html: null };
    }

    const { regionName, campaigns, date } = data;
    const template = CampaignDigestEmail({
        regionName,
        campaigns: campaigns ?? [],
        date: date ?? new Date().toISOString().split('T')[0],
        unsubscribeUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma'}/unsubscribe?token=preview`,
    });

    const html = await render(template, { pretty: true });
    return { html };
}

export async function sendTestDigestEmail(
    recipientEmail: string,
    regionId: number,
    useRealData: boolean,
) {
    try {
        const user = await getUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
            return {
                success: false,
                error:
                    'Non autorisé. Seuls les administrateurs et organisations peuvent envoyer des emails de test.',
            };
        }

        if (!recipientEmail?.trim()) {
            return { success: false, error: 'Email du destinataire requis.' };
        }

        const data = await getDigestTestData(regionId, useRealData);
        if (data.error && !data.regionName) {
            return { success: false, error: data.error };
        }

        const { regionName, campaigns, date } = data;
        if (!campaigns?.length) {
            return {
                success: false,
                error: useRealData
                    ? 'Aucune campagne trouvée pour cette région à ce jour. Utilisez des données de démonstration.'
                    : 'Aucune campagne à afficher.',
            };
        }

        const dateForSubject = new Date((date ?? '') + 'T12:00:00').toLocaleDateString(
            'fr-FR',
            { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        );

        const token = await createUnsubscribeToken(
            recipientEmail.trim(),
            'CAMPAIGN_DIGEST',
        );
        const unsubscribeUrl = getUnsubscribeUrl(token);

        const template = CampaignDigestEmail({
            regionName,
            campaigns,
            date: date ?? new Date().toISOString().split('T')[0],
            unsubscribeUrl,
        });

        const emailHtml = await render(template, { pretty: true });
        const emailText = await render(template, { plainText: true });

        await sendEmail(
            recipientEmail.trim(),
            `📅 Résumé des campagnes de don de sang - ${regionName} - ${dateForSubject}`,
            emailHtml,
            emailText,
        );

        return {
            success: true,
            message: `Email de test (digest) envoyé à ${recipientEmail}.`,
        };
    } catch (error) {
        console.error('Error sending test digest email:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Erreur lors de l'envoi de l'email de test.",
        };
    }
}

// ─── Urgent blood request template test (uses real /emails/urgent-blood-request.tsx) ─

const SAMPLE_BLOOD_REQUEST = {
    bloodGroup: getBloodGroupLabel(BloodGroup.O_POSITIVE, null, 'request'),
    location: 'Hôpital Ibn Sina, bloc B',
    city: 'Rabat',
    phone: '+212 5XX XXX XXX',
    description: 'Patient en urgence, besoin de sang O+ pour intervention.',
};

export async function getBloodRequestsForTest() {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
        return { error: 'Non autorisé', requests: [] };
    }
    const requests = await prisma.bloodRequest.findMany({
        where: { status: 'active' },
        include: { city: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
    });
    return {
        requests: requests.map(r => ({
            id: r.id,
            bloodGroup: r.bloodGroup,
            location: r.location,
            city: r.city.name,
            phone: r.phone,
            description: r.description,
        })),
    };
}

export async function getBloodRequestPreviewHtml(requestId: number | null) {
    const user = await getUser();
    if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
        return { error: 'Non autorisé', html: null };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
    const unsubscribeUrl = `${baseUrl}/unsubscribe?token=preview`;

    if (!requestId) {
        const template = UrgentBloodRequestEmail({
            ...SAMPLE_BLOOD_REQUEST,
            unsubscribeUrl,
        });
        const html = await render(template, { pretty: true });
        return { html };
    }

    const request = await prisma.bloodRequest.findUnique({
        where: { id: requestId },
        include: { city: { select: { name: true } } },
    });
    if (!request) return { error: 'Demande introuvable', html: null };

    const template = UrgentBloodRequestEmail({
        bloodGroup: getBloodGroupLabel(request.bloodGroup as BloodGroup, null, 'request'),
        location: request.location,
        city: request.city.name,
        phone: request.phone ?? undefined,
        description: request.description,
        unsubscribeUrl,
    });
    const html = await render(template, { pretty: true });
    return { html };
}

export async function sendTestBloodRequestEmail(
    recipientEmail: string,
    requestId: number | null,
) {
    try {
        const user = await getUser();
        if (!user || (user.role !== 'ADMIN' && user.role !== 'ORGANIZATION')) {
            return {
                success: false,
                error: 'Non autorisé. Seuls les administrateurs et organisations peuvent envoyer des emails de test.',
            };
        }
        if (!recipientEmail?.trim()) {
            return { success: false, error: 'Email du destinataire requis.' };
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://tabarro3.ma';
        let bloodGroup: string;
        let location: string;
        let city: string;
        let phone: string | undefined;
        let description: string;

        if (requestId) {
            const request = await prisma.bloodRequest.findUnique({
                where: { id: requestId },
                include: { city: { select: { name: true } } },
            });
            if (!request) return { success: false, error: 'Demande introuvable.' };
            bloodGroup = getBloodGroupLabel(request.bloodGroup as BloodGroup, null, 'request');
            location = request.location;
            city = request.city.name;
            phone = request.phone ?? undefined;
            description = request.description;
        } else {
            ({ bloodGroup, location, city, phone, description } = SAMPLE_BLOOD_REQUEST);
        }

        const token = await createUnsubscribeToken(recipientEmail.trim(), 'BLOOD_REQUEST');
        const unsubscribeUrl = getUnsubscribeUrl(token);

        const template = UrgentBloodRequestEmail({
            bloodGroup,
            location,
            city,
            phone,
            description,
            unsubscribeUrl,
        });
        const emailHtml = await render(template, { pretty: true });
        const emailText = await render(template, { plainText: true });

        await sendEmail(
            recipientEmail.trim(),
            `Besoin urgent de sang ${bloodGroup} à ${city} - Votre sang est compatible`,
            emailHtml,
            emailText,
        );

        return {
            success: true,
            message: `Email de test (demande urgente) envoyé à ${recipientEmail}.`,
        };
    } catch (error) {
        console.error('Error sending test blood request email:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Erreur lors de l'envoi de l'email de test.",
        };
    }
}
