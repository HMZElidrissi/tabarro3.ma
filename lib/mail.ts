import { PasswordResetEmail } from '@/emails/password-reset';
import { PasswordChangedEmail } from '@/emails/password-changed';
import { InvitationEmail } from '@/emails/invitation-email';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@tabarro3.ma';

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const emailHtml = await render(PasswordResetEmail({ resetLink }), {
        pretty: true,
    });
    const emailText = await render(PasswordResetEmail({ resetLink }), {
        plainText: true,
    });

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Réinitialisation de votre mot de passe',
            text: emailText,
            html: emailHtml,
        });
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export async function sendPasswordChangedEmail(email: string) {
    const emailHtml = await render(PasswordChangedEmail(), { pretty: true });
    const emailText = await render(PasswordChangedEmail(), { plainText: true });

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Votre mot de passe a été changé',
            text: emailText,
            html: emailHtml,
        });
        console.log('Password changed email sent successfully.');
    } catch (error) {
        console.error('Error sending password changed email:', error);
    }
}

export async function sendInvitationEmail(email: string, token: string) {
    try {
        // Get the invitation details to include the inviter's name
        const invitation = await prisma.invitation.findFirst({
            where: { token },
            include: {
                inviter: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;
        const emailHtml = await render(
            InvitationEmail({
                inviteLink,
            }),
            {
                pretty: true,
            },
        );
        const emailText = await render(
            InvitationEmail({
                inviteLink,
            }),
            {
                plainText: true,
            },
        );

        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Invitation à rejoindre tabarro3.ma',
            text: emailText,
            html: emailHtml,
        });
    } catch (error) {
        console.error('Error sending invitation email:', error);
        throw error;
    }
}
