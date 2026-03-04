import { PasswordResetEmail } from '@/emails/password-reset';
import { PasswordChangedEmail } from '@/emails/password-changed';
import { InvitationEmail } from '@/emails/invitation-email';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

const FROM = '"tabarro3" <notify@tabarro3.ma>';

// ─── Core send helper ─────────────────────────────────────────────────────────

async function sendEmail(
    email: string,
    subject: string,
    html: string,
    text: string,
) {
    const mailOptions = {
        from: FROM,
        to: email,
        subject,
        html,
        text,
    };

    const { data, error } = await resend.emails.send(mailOptions);
    const statusCode = (error as { statusCode?: number } | null | undefined)
        ?.statusCode;

    if (statusCode === 429) {
        console.warn('Resend rate limit hit, falling back to nodemailer.');
        await transporter.sendMail(mailOptions);
        return;
    }

    if (error) {
        throw new Error(
            `Resend error [${statusCode ?? 'unknown'}] ${error.name}: ${
                error.message
            }`,
        );
    }

    console.log(`Email sent via Resend. ID: ${data?.id}`);
}

// ─── Public email functions ───────────────────────────────────────────────────

export async function sendPasswordResetEmail(email: string, token: string) {
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const emailHtml = await render(PasswordResetEmail({ resetLink }), {
        pretty: true,
    });
    const emailText = await render(PasswordResetEmail({ resetLink }), {
        plainText: true,
    });

    try {
        await sendEmail(
            email,
            'Réinitialisation de votre mot de passe',
            emailHtml,
            emailText,
        );
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export async function sendPasswordChangedEmail(email: string) {
    const emailHtml = await render(PasswordChangedEmail(), { pretty: true });
    const emailText = await render(PasswordChangedEmail(), { plainText: true });

    try {
        await sendEmail(
            email,
            'Votre mot de passe a été changé',
            emailHtml,
            emailText,
        );
        console.log('Password changed email sent successfully.');
    } catch (error) {
        console.error('Error sending password changed email:', error);
    }
}

export async function sendInvitationEmail(email: string, token: string) {
    try {
        const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;

        const emailHtml = await render(InvitationEmail({ inviteLink }), {
            pretty: true,
        });
        const emailText = await render(InvitationEmail({ inviteLink }), {
            plainText: true,
        });

        await sendEmail(
            email,
            'Invitation à rejoindre tabarro3.ma',
            emailHtml,
            emailText,
        );
    } catch (error) {
        console.error('Error sending invitation email:', error);
        throw error;
    }
}
