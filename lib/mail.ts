import { PasswordResetEmail } from '@/emails/password-reset';
import { PasswordChangedEmail } from '@/emails/password-changed';
import { InvitationEmail } from '@/emails/invitation-email';
import { EmailVerificationEmail } from '@/emails/email-verification';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';
import { Resend } from 'resend';
import { getResolvedLocale } from '@/i18n/i18n-config';
import { getDictionaryForLocale } from '@/i18n/get-dictionary';

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
        // Cast to string because the Resend SDK type union is incomplete and
        // doesn't include 'monthly_quota_exceeded' / 'daily_quota_exceeded'.
        const errorName = (error as { name?: string } | null)?.name;
        if (errorName === 'monthly_quota_exceeded') {
            console.error(
                'Resend monthly quota exceeded — falling back to nodemailer. Consider upgrading your plan.',
            );
        } else if (errorName === 'daily_quota_exceeded') {
            console.error(
                'Resend daily quota exceeded — falling back to nodemailer. Quota resets after 24 hours.',
            );
        } else {
            console.warn('Resend rate limit hit — falling back to nodemailer.');
        }
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
    const loc = getResolvedLocale(locale);
    const dict = await getDictionaryForLocale(loc);
    const t = dict.emails.passwordReset;
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${token}`;

    const emailHtml = await render(
        PasswordResetEmail({ resetLink, locale: loc, t }),
        { pretty: true },
    );
    const emailText = await render(
        PasswordResetEmail({ resetLink, locale: loc, t }),
        { plainText: true },
    );

    try {
        await sendEmail(email, t.subject, emailHtml, emailText);
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
    }
}

export async function sendPasswordChangedEmail(
    email: string,
    locale?: string | null,
) {
    const loc = getResolvedLocale(locale);
    const dict = await getDictionaryForLocale(loc);
    const t = dict.emails.passwordChanged;

    const emailHtml = await render(PasswordChangedEmail({ locale: loc, t }), {
        pretty: true,
    });
    const emailText = await render(PasswordChangedEmail({ locale: loc, t }), {
        plainText: true,
    });

    try {
        await sendEmail(email, t.subject, emailHtml, emailText);
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
    const loc = getResolvedLocale(locale);
    const dict = await getDictionaryForLocale(loc);
    const t = dict.emails.invitation;
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/accept-invitation?token=${token}&email=${encodeURIComponent(email)}`;

    try {
        const emailHtml = await render(
            InvitationEmail({ inviteLink, locale: loc, t }),
            { pretty: true },
        );
        const emailText = await render(
            InvitationEmail({ inviteLink, locale: loc, t }),
            { plainText: true },
        );

        await sendEmail(email, t.subject, emailHtml, emailText);
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
    const loc = getResolvedLocale(locale);
    const dict = await getDictionaryForLocale(loc);
    const t = dict.emails.verification;
    const verifyLink = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email/${token}`;

    try {
        const emailHtml = await render(
            EmailVerificationEmail({ verifyLink, locale: loc, t }),
            { pretty: true },
        );
        const emailText = await render(
            EmailVerificationEmail({ verifyLink, locale: loc, t }),
            { plainText: true },
        );

        await sendEmail(email, t.subject, emailHtml, emailText);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw error;
    }
}
