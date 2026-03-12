import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
    Link,
} from '@react-email/components';
import { fr } from 'date-fns/locale';
import { ar } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';
import * as React from 'react';
interface Campaign {
    id: number;
    name: string;
    description: string;
    location: string;
    startTime: string;
    endTime: string;
    organization: {
        name: string;
    };
    city: {
        name: string;
    };
}

const defaultDigestT = {
    subjectPrefix: 'Résumé des campagnes de don de sang',
    title: 'Résumé des campagnes du jour',
    dateLabel: '{date} - {regionName}',
    intro: "Voici les nouvelles campagnes de don de sang organisées aujourd'hui dans votre région :",
    organizedBy: 'Organisé par :',
    date: 'Date :',
    time: 'Horaire :',
    location: 'Lieu :',
    city: 'Ville :',
    participate: 'Je participe',
    tipsTitle: 'Conseils pour votre don',
    tip1: 'Bien manger et vous hydrater avant le don',
    tip2: "Apporter une pièce d'identité",
    tip3: "Prévoir environ 45 minutes pour l'ensemble du processus",
    tip4: 'Éviter les activités physiques intenses après le don',
    viewAll: 'Voir toutes les campagnes',
    footerReason:
        'Vous recevez ce résumé quotidien car vous êtes inscrit dans la région {regionName}.',
    unsubscribe: 'Se désabonner',
    unsubscribePrompt:
        'Vous ne souhaitez plus recevoir le récapitulatif des campagnes dans votre région ?',
    autoSent:
        'Cet email est envoyé automatiquement. Veuillez ne pas y répondre directement.',
    footer: '© {year} tabarro3. Tous droits réservés.',
};

interface CampaignDigestEmailProps {
    regionName: string;
    campaigns: Campaign[];
    date: string;
    unsubscribeUrl?: string;
    locale?: string;
    t?: typeof defaultDigestT;
}

export const CampaignDigestEmail = ({
    regionName,
    campaigns,
    date,
    unsubscribeUrl,
    locale = 'fr',
    t = defaultDigestT,
}: CampaignDigestEmailProps) => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const bodyStyle =
        dir === 'rtl'
            ? { direction: 'rtl' as const, textAlign: 'right' as const }
            : undefined;
    const dateLocale = locale === 'ar' ? ar : locale === 'en' ? enUS : fr;
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const formattedDate = format(dateObj, 'dd MMMM yyyy', {
        locale: dateLocale,
    });
    const year = new Date().getFullYear();
    return (
        <Html lang={locale} dir={dir}>
            <Preview>
                📅 {t.title} - {regionName}
            </Preview>
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
                }}
            >
                <Body className="bg-gray-50 py-10" style={bodyStyle}>
                    <Container className="bg-white rounded-lg shadow-lg mx-auto p-8 max-w-[600px]">
                        <Section className="text-center mb-8">
                            <Img
                                src="https://tabarro3.ma/logo.png"
                                width="140"
                                height="auto"
                                alt="tabarro3"
                                className="mx-auto"
                            />
                        </Section>

                        <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
                            📅 {t.title}
                        </Text>

                        <Text className="text-lg text-gray-600 text-center mb-6">
                            {formattedDate} - {regionName}
                        </Text>

                        <Text className="text-gray-600 text-base mb-6">
                            {t.intro}
                        </Text>

                        {campaigns.map((campaign, index) => {
                            const startDate = new Date(campaign.startTime);
                            const endDate = new Date(campaign.endTime);

                            return (
                                <Section
                                    key={campaign.id}
                                    className={`bg-gray-50 p-6 rounded-lg mb-6 border-brand-500 ${dir === 'rtl' ? 'border-r-4' : 'border-l-4'}`}
                                >
                                    <Text className="text-xl font-bold text-gray-900 mb-3">
                                        {campaign.name}
                                    </Text>

                                    <Text className="text-gray-700 mb-3">
                                        {campaign.description}
                                    </Text>

                                    <Section className="mb-4">
                                        <Text className="text-gray-600 mb-2">
                                            🏥 <strong>{t.organizedBy}</strong>{' '}
                                            {campaign.organization.name}
                                        </Text>
                                        <Text className="text-gray-600 mb-2">
                                            📅 <strong>{t.date}</strong>{' '}
                                            {startDate.toLocaleDateString(
                                                locale === 'ar'
                                                    ? 'ar-MA'
                                                    : locale === 'en'
                                                      ? 'en-GB'
                                                      : 'fr-FR',
                                            )}
                                        </Text>
                                        <Text className="text-gray-600 mb-2">
                                            🕒 <strong>{t.time}</strong>{' '}
                                            {startDate.toLocaleTimeString(
                                                locale === 'ar'
                                                    ? 'ar-MA'
                                                    : locale === 'en'
                                                      ? 'en-GB'
                                                      : 'fr-FR',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )}{' '}
                                            -{' '}
                                            {endDate.toLocaleTimeString(
                                                locale === 'ar'
                                                    ? 'ar-MA'
                                                    : locale === 'en'
                                                      ? 'en-GB'
                                                      : 'fr-FR',
                                                {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                },
                                            )}
                                        </Text>
                                        <Text className="text-gray-600 mb-2">
                                            📍 <strong>{t.location}</strong>{' '}
                                            {campaign.location}
                                        </Text>
                                        <Text className="text-gray-600">
                                            🏢 <strong>{t.city}</strong>{' '}
                                            {campaign.city.name}
                                        </Text>
                                    </Section>

                                    <Section className="text-center">
                                        <Button
                                            href={`https://tabarro3.ma/campaigns`}
                                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-4 py-2 rounded-md font-semibold text-sm inline-block transition-colors"
                                        >
                                            {t.participate}
                                        </Button>
                                    </Section>
                                </Section>
                            );
                        })}

                        <Section className="bg-brand-50 p-6 rounded-lg mb-6">
                            <Text className="text-brand-800 font-semibold text-center mb-3">
                                💡 {t.tipsTitle}
                            </Text>
                            <Text className="text-brand-700 text-sm mb-2">
                                • {t.tip1}
                            </Text>
                            <Text className="text-brand-700 text-sm mb-2">
                                • {t.tip2}
                            </Text>
                            <Text className="text-brand-700 text-sm mb-2">
                                • {t.tip3}
                            </Text>
                            <Text className="text-brand-700 text-sm">
                                • {t.tip4}
                            </Text>
                        </Section>

                        <Section className="text-center my-8">
                            <Button
                                href="https://tabarro3.ma/campaigns"
                                className="bg-gray-800 hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:border-gray-950 focus:ring ring-gray-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                            >
                                {t.viewAll}
                            </Button>
                        </Section>

                        <Hr className="border-gray-200 my-8" />

                        <Text className="text-gray-500 text-sm text-center mb-4">
                            {t.footerReason.replace('{regionName}', regionName)}
                        </Text>

                        {unsubscribeUrl && (
                            <Text className="text-gray-500 text-xs text-center mb-4">
                                {t.unsubscribePrompt}{' '}
                                <Link
                                    href={unsubscribeUrl}
                                    className="text-brand-600 hover:text-brand-700"
                                >
                                    {t.unsubscribe}
                                </Link>
                                .
                            </Text>
                        )}

                        <Hr className="border-gray-200 my-6" />

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

export default CampaignDigestEmail;
