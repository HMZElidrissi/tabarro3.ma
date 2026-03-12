import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Img,
    Tailwind,
} from '@react-email/components';
const defaultT = {
    subject: 'Confirmez votre adresse e-mail',
    preview: 'Confirmez votre adresse e-mail',
    title: 'Confirmez votre adresse e-mail',
    bodyThanks: 'Merci de rejoindre tabarro3, la plateforme dédiée à la sensibilisation et à la promotion du don de sang au Maroc.',
    bodyConfirm: 'Pour finaliser la création de votre compte et accéder à toutes les fonctionnalités, veuillez confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous.',
    cta: 'Confirmer mon e-mail',
    securityNote: "Pour des raisons de sécurité, ce lien expirera dans 24 heures. Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet e-mail.",
};

interface EmailVerificationProps {
    verifyLink: string;
    locale?: string;
    t?: typeof defaultT;
}

export const EmailVerificationEmail = ({
    verifyLink,
    locale = 'fr',
    t = defaultT,
}: EmailVerificationProps) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const bodyStyle =
        dir === 'rtl'
            ? { direction: 'rtl' as const, textAlign: 'right' as const }
            : undefined;
    return (
    <Html lang={locale} dir={dir}>
        <Head />
        <Preview>{t.preview}</Preview>
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
            }}
        >
            <Body className="bg-gray-50 py-10" style={bodyStyle}>
                <Container className="bg-white rounded-lg shadow-lg mx-auto p-8 max-w-[580px]">
                    <Section className="text-center mb-8">
                        <Img
                            src="https://tabarro3.ma/logo.png"
                            width="140"
                            height="auto"
                            alt="tabarro3"
                            className="mx-auto"
                        />
                    </Section>

                    <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
                        {t.title}
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.bodyThanks}
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.bodyConfirm}
                    </Text>

                    <Section className="text-center my-8">
                        <Button
                            href={verifyLink}
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            {t.cta}
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.securityNote}
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
    );
};

export default EmailVerificationEmail;
