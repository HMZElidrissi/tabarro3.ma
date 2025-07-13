'use server';

import { getUser } from '@/auth/session';
import { render } from '@react-email/components';
import CustomEmail from '@/emails/custom-email';
import { transporter } from '@/lib/mail';

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
        const emailHtml = render(
            CustomEmail({
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
            }),
        );

        // Send the email
        await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: emailData.recipientEmail,
            subject: emailData.subject,
            html: await emailHtml,
        });

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
