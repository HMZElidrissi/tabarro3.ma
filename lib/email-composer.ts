import { EmailData } from '@/types/email';

function getButtonStyle(style: string): string {
    switch (style) {
        case 'primary':
            return 'background: #e22021; color: white; border: 1px solid #e22021;';
        case 'secondary':
            return 'background: #4b5563; color: white; border: 1px solid #4b5563;';
        case 'outline':
            return 'background: transparent; color: #e22021; border: 2px solid #e22021;';
        default:
            return 'background: #e22021; color: white; border: 1px solid #e22021;';
    }
}

export function generatePreviewHTML(
    data: EmailData,
    isDarkMode = false,
): string {
    const colors = {
        bg: isDarkMode ? '#000000' : '#f9fafb',
        containerBg: isDarkMode ? '#030712' : '#ffffff',
        text: isDarkMode ? '#f9fafb' : '#111827',
        subtext: isDarkMode ? '#d1d5db' : '#4b5563',
        footerText: isDarkMode ? '#9ca3af' : '#6b7280',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        highlightBg: isDarkMode ? '#000000' : '#f9fafb',
        highlightText: isDarkMode ? '#e5e7eb' : '#374151',
    };

    let html = `<div style="background: ${colors.bg}; padding: 40px;">`;
    html += `<div style="max-width: 600px; margin: 0 auto; background: ${colors.containerBg}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 32px; font-family: Arial, sans-serif;">`;

    // Header with logo
    if (data.showLogo) {
        html += `<div style="text-align: center; margin-bottom: 32px;">`;
        html += `<img src="${data.logoUrl}" width="${data.logoWidth}" alt="logo" style="margin: 0 auto;" />`;
        html += `</div>`;
    }

    // Title
    html += `<h1 style="text-align: center; font-size: 24px; font-weight: bold; color: ${colors.text}; margin-bottom: 24px;">${data.title}</h1>`;

    // Content
    html += `<p style="color: ${colors.subtext}; margin-bottom: 16px; text-align: left;">${data.greeting}</p>`;
    html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: left;">${data.message}</p>`;

    // Highlight box
    if (data.showHighlight && data.highlightContent) {
        html += `<div style="background: ${colors.highlightBg}; padding: 24px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #e22021;">`;
        if (data.highlightTitle) {
            html += `<p style="color: ${colors.highlightText}; font-weight: 600; margin-bottom: 12px; text-align: left;">${data.highlightIcon} ${data.highlightTitle}</p>`;
        }
        html += `<p style="color: ${colors.subtext}; margin: 0; text-align: left; white-space: pre-wrap;">${data.highlightContent}</p>`;
        html += `</div>`;
    }

    // Additional content
    if (data.additionalContent) {
        html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: left;">${data.additionalContent}</p>`;
    }

    // Buttons
    if (data.primaryButton.enabled || data.secondaryButton.enabled) {
        html += `<div style="margin: 32px 0; text-align: center;">`;
        if (data.primaryButton.enabled) {
            const buttonStyle = getButtonStyle(data.primaryButton.style);
            html += `<a href="${data.primaryButton.url}" style="${buttonStyle} padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; margin-right: 12px;">${data.primaryButton.text}</a>`;
        }
        if (data.secondaryButton.enabled) {
            const buttonStyle = getButtonStyle(data.secondaryButton.style);
            html += `<a href="${data.secondaryButton.url}" style="${buttonStyle} padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block;">${data.secondaryButton.text}</a>`;
        }
        html += `</div>`;
    }

    // Signature
    if (data.showSignature && data.signature) {
        html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: left;">${data.signature}</p>`;
    }

    // Footer
    if (data.showFooter) {
        html += `<hr style="border: none; border-top: 1px solid ${colors.borderColor}; margin: 32px 0;" />`;

        if (data.footerText) {
            html += `<p style="color: ${colors.footerText}; font-size: 14px; text-align: left; margin-bottom: 16px;">${data.footerText}</p>`;
        }

        if (data.customFooterLinks.length > 0) {
            html += `<div style="text-align: left; margin-bottom: 16px;">`;
            data.customFooterLinks.forEach((link, index) => {
                html += `<a href="${link.url}" style="color: #e22021; font-size: 14px; text-decoration: none; margin: 0 8px;">${link.text}</a>`;
                if (index < data.customFooterLinks.length - 1) {
                    html += `<span style="color: #9ca3af; margin: 0 4px;">|</span>`;
                }
            });
            html += `</div>`;
        }

        if (data.showCopyright) {
            html += `<p style="color: ${colors.footerText}; font-size: 14px; text-align: center;">© ${new Date().getFullYear()} tabarro3. Tous droits réservés.</p>`;
        }
    }

    html += `</div></div>`;
    return html;
}
