import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Img,
    Hr,
    Tailwind,
} from '@react-email/components';
const defaultT = {
    subject: 'Réinitialisation de votre mot de passe',
    preview: 'Réinitialisez votre mot de passe tabarro3 — ce lien expire dans 60 minutes',
    title: 'Réinitialisation du mot de passe',
    greeting: 'Bonjour,',
    body: 'Nous avons reçu une demande de réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour en choisir un nouveau :',
    cta: 'Réinitialiser le mot de passe',
    expiryNote: "Pour des raisons de sécurité, cette demande expirera dans 60 minutes. Après ce délai, vous devrez soumettre une nouvelle demande.",
    ignoreNote: "Si vous n'avez pas demandé ce changement, vous pouvez ignorer cet email en toute sécurité.",
    linkHint: 'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
    footer: '© {year} tabarro3. Tous droits réservés.',
};

interface PasswordResetEmailProps {
    resetLink: string;
    locale?: string;
    t?: typeof defaultT;
}

export const PasswordResetEmail = ({
    resetLink,
    locale = 'fr',
    t = defaultT,
}: PasswordResetEmailProps) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const bodyStyle =
        dir === 'rtl'
            ? { direction: 'rtl' as const, textAlign: 'right' as const }
            : undefined;
    const year = new Date().getFullYear();
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
                        {t.greeting}
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.body}
                    </Text>

                    <Section className="text-center my-8">
                        <Button
                            href={resetLink}
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            {t.cta}
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.expiryNote}
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.ignoreNote}
                    </Text>

                    <Text className="text-gray-500 text-sm mt-6 mb-2">
                        {t.linkHint}
                    </Text>
                    <Link
                        href={resetLink}
                        className="text-brand-600 text-sm break-all no-underline hover:underline"
                    >
                        {resetLink}
                    </Link>

                    <Hr className="border-gray-200 my-8" />

                    <Text className="text-gray-500 text-sm text-center">
                        {t.footer.replace('{year}', String(year))}
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
    );
};

export default PasswordResetEmail;
