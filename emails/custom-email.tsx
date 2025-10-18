import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Section,
    Text,
    Link,
    Img,
    Hr,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface CustomEmailProps {
    // Logo options
    showLogo: boolean;
    logoUrl?: string;
    logoWidth?: number;

    // Content
    title: string;
    greeting: string;
    message: string;

    // Highlight box (optional)
    showHighlight: boolean;
    highlightTitle?: string;
    highlightContent?: string;
    highlightIcon?: string;

    // Buttons (multiple optional)
    primaryButton?: {
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };
    secondaryButton?: {
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };

    // Additional content
    additionalContent?: string;
    showSignature: boolean;
    signature?: string;

    // Footer options
    showFooter: boolean;
    footerText?: string;
    showCopyright: boolean;
    customFooterLinks?: Array<{ text: string; url: string }>;
}

export default function CustomEmail({
    showLogo = true,
    logoUrl = 'https://tabarro3.ma/logo.png',
    logoWidth = 140,
    title = 'Welcome to tabarro3!',
    greeting = 'Hello there,',
    message = 'Thank you for joining our blood donation community.',
    showHighlight = false,
    highlightTitle = '',
    highlightContent = '',
    highlightIcon = '🩸',
    primaryButton,
    secondaryButton,
    additionalContent = '',
    showSignature = true,
    signature = 'Best regards,\nThe tabarro3 Team',
    showFooter = true,
    footerText = '',
    showCopyright = true,
    customFooterLinks = [],
}: CustomEmailProps) {
    const getButtonStyles = (style: 'primary' | 'secondary' | 'outline') => {
        switch (style) {
            case 'primary':
                return 'bg-brand-600 hover:bg-brand-700 text-white border-brand-600';
            case 'secondary':
                return 'bg-gray-600 hover:bg-gray-700 text-white border-gray-600';
            case 'outline':
                return 'bg-transparent hover:bg-brand-50 text-brand-600 border-brand-600 border-2';
            default:
                return 'bg-brand-600 hover:bg-brand-700 text-white border-brand-600';
        }
    };

    const containerStyles =
        'bg-white rounded-lg shadow-lg mx-auto p-8 max-w-[580px]';

    return (
        <Html>
            <Head />
            <Tailwind
                config={{
                    theme: {
                        extend: {
                            colors: {
                                brand: {
                                    '50': '#fef2f2',
                                    '100': '#ffe1e1',
                                    '200': '#ffc8c8',
                                    '300': '#ffa2a3',
                                    '400': '#fc6d6e',
                                    '500': '#f54748',
                                    '600': '#e22021',
                                    '700': '#be1718',
                                    '800': '#9d1718',
                                    '900': '#821a1b',
                                    '950': '#470808',
                                },
                            },
                        },
                    },
                }}>
                <Body className="bg-gray-50 py-10">
                    <Container className={containerStyles}>
                        {/* Header Section - Centered Layout */}
                        {showLogo && (
                            <Section className="text-center mb-8">
                                <Img
                                    src={logoUrl}
                                    width={logoWidth}
                                    height="auto"
                                    alt="tabarro3"
                                    className="mx-auto"
                                />
                            </Section>
                        )}

                        <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
                            {title}
                        </Text>

                        <Section>
                            {/* Greeting */}
                            <Text className="text-gray-600 text-base mb-4 text-left">
                                {greeting}
                            </Text>

                            {/* Main Message */}
                            <Text className="text-gray-600 text-base mb-6 whitespace-pre-wrap text-left">
                                {message}
                            </Text>

                            {/* Highlight Box */}
                            {showHighlight && highlightContent && (
                                <Section className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-brand-600">
                                    {highlightTitle && (
                                        <Text className="text-gray-700 font-semibold mb-3 text-left">
                                            {highlightIcon} {highlightTitle}
                                        </Text>
                                    )}
                                    <Text className="text-gray-600 text-left whitespace-pre-wrap m-0">
                                        {highlightContent}
                                    </Text>
                                </Section>
                            )}

                            {/* Additional Content */}
                            {additionalContent && (
                                <Text className="text-gray-600 text-base mb-6 whitespace-pre-wrap text-left">
                                    {additionalContent}
                                </Text>
                            )}

                            {/* Buttons */}
                            {(primaryButton || secondaryButton) && (
                                <Section className="my-8 text-center">
                                    <div className="space-y-3">
                                        {primaryButton && (
                                            <Button
                                                href={primaryButton.url}
                                                className={`${getButtonStyles(primaryButton.style)} shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors mr-3`}>
                                                {primaryButton.text}
                                            </Button>
                                        )}
                                        {secondaryButton && (
                                            <Button
                                                href={secondaryButton.url}
                                                className={`${getButtonStyles(secondaryButton.style)} shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors`}>
                                                {secondaryButton.text}
                                            </Button>
                                        )}
                                    </div>
                                </Section>
                            )}

                            {/* Signature */}
                            {showSignature && signature && (
                                <Text className="text-gray-600 text-base mb-6 whitespace-pre-wrap text-left">
                                    {signature}
                                </Text>
                            )}
                        </Section>

                        {/* Footer */}
                        {showFooter && (
                            <>
                                <Hr className="border-gray-200 my-8" />

                                {footerText && (
                                    <Text className="text-gray-500 text-sm mb-4 text-center">
                                        {footerText}
                                    </Text>
                                )}

                                {/* Custom Footer Links */}
                                {customFooterLinks.length > 0 && (
                                    <Section className="text-center mb-4">
                                        {customFooterLinks.map(
                                            (link, index) => (
                                                <React.Fragment key={index}>
                                                    <Link
                                                        href={link.url}
                                                        className="text-brand-600 text-sm hover:underline mx-2">
                                                        {link.text}
                                                    </Link>
                                                    {index <
                                                        customFooterLinks.length -
                                                            1 && (
                                                        <Text className="text-gray-400 text-sm inline mx-1">
                                                            |
                                                        </Text>
                                                    )}
                                                </React.Fragment>
                                            ),
                                        )}
                                    </Section>
                                )}

                                {showCopyright && (
                                    <Text className="text-gray-500 text-sm text-center">
                                        © {new Date().getFullYear()} tabarro3.
                                        Tous droits réservés.
                                    </Text>
                                )}
                            </>
                        )}
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
