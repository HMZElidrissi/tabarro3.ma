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
    Hr,
    Tailwind,
} from '@react-email/components';
const defaultBloodT = {
    subjectPrefix: 'Besoin urgent de sang',
    title: 'BESOIN URGENT DE SANG',
    intro: 'Un donneur de sang du groupe {bloodGroup} est urgemment recherché. Votre sang est compatible et peut sauver une vie !',
    detailsTitle: 'Détails de la demande :',
    bloodGroup: 'Groupe sanguin :',
    location: 'Lieu :',
    city: 'Ville :',
    contact: 'Contact :',
    description: 'Description :',
    cta: 'Voir les détails',
    shareNote: "Si vous ne pouvez pas donner, merci de partager cette demande avec votre entourage. Chaque partage peut aider à sauver une vie.",
    unsubscribe: 'Se désabonner',
    unsubscribePrompt: 'Vous ne souhaitez plus recevoir de notifications pour les demandes urgentes de sang ?',
    autoSent: "Cet email est envoyé automatiquement. Veuillez ne pas y répondre directement.",
    footer: '© {year} tabarro3. Tous droits réservés.',
};

interface UrgentBloodRequestEmailProps {
    bloodGroup: string;
    location: string;
    city: string;
    phone?: string;
    description: string;
    unsubscribeUrl?: string;
    locale?: string;
    t?: typeof defaultBloodT;
}

export const UrgentBloodRequestEmail = ({
    bloodGroup,
    location,
    city,
    phone,
    description,
    unsubscribeUrl,
    locale = 'fr',
    t = defaultBloodT,
}: UrgentBloodRequestEmailProps) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const bodyStyle =
        dir === 'rtl'
            ? { direction: 'rtl' as const, textAlign: 'right' as const }
            : undefined;
    const year = new Date().getFullYear();
    const intro = t.intro.replace('{bloodGroup}', bloodGroup);
    return (
    <Html lang={locale} dir={dir}>
        <Head />
        <Preview>
            🩸 {t.subjectPrefix} {bloodGroup} — {city}
        </Preview>
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

                    <Text className="text-2xl font-bold text-brand-600 text-center mb-6">
                        {t.title}
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        {intro}
                    </Text>

                    <Section className="bg-gray-50 p-4 rounded-lg mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">
                            {t.detailsTitle}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            🩸 {t.bloodGroup} {bloodGroup}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            📍 {t.location} {location}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            🏢 {t.city} {city}
                        </Text>
                        {phone && (
                            <Text className="text-gray-600">
                                📞 {t.contact} {phone}
                            </Text>
                        )}
                        <Text className="text-gray-600">
                            ℹ️ {t.description} {description}
                        </Text>
                    </Section>

                    <Section className="text-center my-8">
                        <Button
                            href="https://tabarro3.ma/requests"
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            {t.cta}
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        {t.shareNote}
                    </Text>

                    <Hr className="border-gray-200 my-8" />

                    {unsubscribeUrl && (
                        <Text className="text-gray-500 text-xs text-center mb-3">
                            {t.unsubscribePrompt}{' '}
                            <a
                                href={unsubscribeUrl}
                                className="text-brand-600 hover:text-brand-700"
                            >
                                {t.unsubscribe}
                            </a>
                            .
                        </Text>
                    )}

                    <Text className="text-gray-400 text-xs text-center mb-2">
                        {t.autoSent}
                    </Text>

                    <Text className="text-gray-500 text-sm text-center">
                        {t.footer.replace('{year}', String(year))}
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
    );
};

export default UrgentBloodRequestEmail;
