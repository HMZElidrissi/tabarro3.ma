import { PasswordResetEmail } from '@/emails/password-reset';
import { PasswordChangedEmail } from '@/emails/password-changed';
import { InvitationEmail } from '@/emails/invitation-email';
import { EmailVerificationEmail } from '@/emails/email-verification';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { getEmailDictionary, getNotificationLocale } from '@/lib/email-i18n';

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

export async function sendEmail(
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

export async function sendPasswordResetEmail(
    email: string,
    token: string,
    locale?: string | null,
) {
    const loc = getNotificationLocale(locale);
    const t = await getEmailDictionary(loc);
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const emailHtml = await render(
        PasswordResetEmail({ resetLink, locale: loc, t: t.passwordReset }),
        { pretty: true },
    );
    const emailText = await render(
        PasswordResetEmail({ resetLink, locale: loc, t: t.passwordReset }),
        { plainText: true },
    );

    try {
        await sendEmail(email, t.passwordReset.subject, emailHtml, emailText);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export async function sendPasswordChangedEmail(
    email: string,
    locale?: string | null,
) {
    const loc = getNotificationLocale(locale);
    const t = await getEmailDictionary(loc);

    const emailHtml = await render(
        PasswordChangedEmail({ locale: loc, t: t.passwordChanged }),
        { pretty: true },
    );
    const emailText = await render(
        PasswordChangedEmail({ locale: loc, t: t.passwordChanged }),
        { plainText: true },
    );

    try {
        await sendEmail(email, t.passwordChanged.subject, emailHtml, emailText);
        console.log('Password changed email sent successfully.');
    } catch (error) {
        console.error('Error sending password changed email:', error);
    }
}

export async function sendInvitationEmail(
    email: string,
    token: string,
    locale?: string | null,
) {
    const loc = getNotificationLocale(locale);
    const t = await getEmailDictionary(loc);
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;

    try {
        const emailHtml = await render(
            InvitationEmail({ inviteLink, locale: loc, t: t.invitation }),
            { pretty: true },
        );
        const emailText = await render(
            InvitationEmail({ inviteLink, locale: loc, t: t.invitation }),
            { plainText: true },
        );

        await sendEmail(email, t.invitation.subject, emailHtml, emailText);
    } catch (error) {
        console.error('Error sending invitation email:', error);
        throw error;
    }
}

export async function sendVerificationEmail(
    email: string,
    token: string,
    locale?: string | null,
) {
    const loc = getNotificationLocale(locale);
    const t = await getEmailDictionary(loc);
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`;

    try {
        const emailHtml = await render(
            EmailVerificationEmail({ verifyLink, locale: loc, t: t.verification }),
            { pretty: true },
        );
        const emailText = await render(
            EmailVerificationEmail({ verifyLink, locale: loc, t: t.verification }),
            { plainText: true },
        );

        await sendEmail(email, t.verification.subject, emailHtml, emailText);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
