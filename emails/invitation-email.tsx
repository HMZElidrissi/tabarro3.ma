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
import type { EmailTranslations } from '@/lib/email-i18n';

interface InvitationEmailProps {
    inviteLink: string;
    locale?: string;
    t?: EmailTranslations['invitation'];
}

const defaultT = {
    subject: 'Invitation à rejoindre tabarro3.ma',
    preview: 'Vous avez été invité à rejoindre tabarro3 — acceptez votre invitation',
    title: 'Invitation à rejoindre tabarro3',
    greeting: 'Cher partenaire potentiel,',
    body: "Nous sommes ravis de vous inviter à rejoindre tabarro3, une plateforme innovante dédiée à la sensibilisation et à la promotion du don de sang au Maroc. En tant qu'organisation engagée dans ce domaine, votre participation serait précieuse pour notre mission commune.",
    bullet1: 'Organiser et gérer des campagnes de don de sang de manière efficace',
    bullet2: 'Connecter directement avec une communauté active de donneurs potentiels',
    bullet3: "Rejoindre un réseau national d'organisations engagées dans le don de sang",
    cta: "Accepter l'invitation",
    expiryNote: "Pour des raisons de sécurité, cette invitation expirera dans 7 jours. Après ce délai, vous devrez demander une nouvelle invitation.",
    linkHint: 'Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :',
    footer: '© {year} tabarro3. Tous droits réservés.',
};

export const InvitationEmail = ({
    inviteLink,
    locale = 'fr',
    t = defaultT,
}: InvitationEmailProps) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
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
            <Body className="bg-gray-50 py-10">
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

                    <Text className="text-gray-600 text-base mb-4">
                        En rejoignant tabarro3, vous pourrez :
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-2">
                        • {t.bullet1}
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-2">
                        • {t.bullet2}
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-4">
                        • {t.bullet3}
                    </Text>

                    <Section className="text-center my-8">
                        <Button
                            href={inviteLink}
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            {t.cta}
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.expiryNote}
                    </Text>

                    <Text className="text-gray-500 text-sm mt-6 mb-2">
                        {t.linkHint}
                    </Text>
                    <Link
                        href={inviteLink}
                        className="text-brand-600 text-sm break-all no-underline hover:underline"
                    >
                        {inviteLink}
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

export default InvitationEmail;
