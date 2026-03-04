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

interface CampaignDigestEmailProps {
    regionName: string;
    campaigns: Campaign[];
    date: string;
}

export const CampaignDigestEmail = ({
    regionName,
    campaigns,
    date,
}: CampaignDigestEmailProps) => (
    <Html lang="fr" dir="ltr">
        <Preview>
            {`📅 ${campaigns.length} nouvelle${
                campaigns.length > 1 ? 's' : ''
            } campagne${
                campaigns.length > 1 ? 's' : ''
            } de don de sang aujourd'hui dans votre région`}
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
            <Body className="bg-gray-50 py-10">
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
                        📅 Résumé des campagnes du jour
                    </Text>

                    <Text className="text-lg text-gray-600 text-center mb-6">
                        {format(date, 'dd MMMM yyyy', { locale: fr })} -{' '}
                        {regionName}
                    </Text>

                    <Text className="text-gray-600 text-base mb-6">
                        Voici les nouvelles campagnes de don de sang organisées
                        aujourd'hui dans votre région :
                    </Text>

                    {campaigns.map((campaign, index) => {
                        const startDate = new Date(campaign.startTime);
                        const endDate = new Date(campaign.endTime);

                        return (
                            <Section
                                key={campaign.id}
                                className="bg-gray-50 p-6 rounded-lg mb-6 border-l-4 border-brand-500"
                            >
                                <Text className="text-xl font-bold text-gray-900 mb-3">
                                    {campaign.name}
                                </Text>

                                <Text className="text-gray-700 mb-3">
                                    {campaign.description}
                                </Text>

                                <Section className="mb-4">
                                    <Text className="text-gray-600 mb-2">
                                        🏥 <strong>Organisé par :</strong>{' '}
                                        {campaign.organization.name}
                                    </Text>
                                    <Text className="text-gray-600 mb-2">
                                        📅 <strong>Date :</strong>{' '}
                                        {startDate.toLocaleDateString('fr-FR')}
                                    </Text>
                                    <Text className="text-gray-600 mb-2">
                                        🕒 <strong>Horaire :</strong>{' '}
                                        {startDate.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}{' '}
                                        -{' '}
                                        {endDate.toLocaleTimeString('fr-FR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </Text>
                                    <Text className="text-gray-600 mb-2">
                                        📍 <strong>Lieu :</strong>{' '}
                                        {campaign.location}
                                    </Text>
                                    <Text className="text-gray-600">
                                        🏢 <strong>Ville :</strong>{' '}
                                        {campaign.city.name}
                                    </Text>
                                </Section>

                                <Section className="text-center">
                                    <Button
                                        href={`https://tabarro3.ma/campaigns`}
                                        className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-4 py-2 rounded-md font-semibold text-sm inline-block transition-colors"
                                    >
                                        Je participe
                                    </Button>
                                </Section>
                            </Section>
                        );
                    })}

                    <Section className="bg-brand-50 p-6 rounded-lg mb-6">
                        <Text className="text-brand-800 font-semibold text-center mb-3">
                            💡 Conseils pour votre don
                        </Text>
                        <Text className="text-brand-700 text-sm mb-2">
                            • Bien manger et vous hydrater avant le don
                        </Text>
                        <Text className="text-brand-700 text-sm mb-2">
                            • Apporter une pièce d'identité
                        </Text>
                        <Text className="text-brand-700 text-sm mb-2">
                            • Prévoir environ 45 minutes pour l'ensemble du
                            processus
                        </Text>
                        <Text className="text-brand-700 text-sm">
                            • Éviter les activités physiques intenses après le
                            don
                        </Text>
                    </Section>

                    <Section className="text-center my-8">
                        <Button
                            href="https://tabarro3.ma/campaigns"
                            className="bg-gray-800 hover:bg-gray-900 active:bg-gray-950 focus:outline-none focus:border-gray-950 focus:ring ring-gray-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            Voir toutes les campagnes
                        </Button>
                    </Section>

                    <Hr className="border-gray-200 my-8" />

                    <Text className="text-gray-500 text-sm text-center mb-4">
                        Vous recevez ce résumé quotidien car vous êtes inscrit
                        dans la région {regionName}.
                    </Text>

                    <Text className="text-gray-500 text-sm text-center">
                        <Link
                            href="https://tabarro3.ma/profile"
                            className="text-brand-600 hover:text-brand-700"
                        >
                            Gérer mes préférences de notification
                        </Link>
                    </Text>

                    <Hr className="border-gray-200 my-6" />

                    <Text className="text-gray-400 text-xs text-center mb-2">
                        Cet email est envoyé automatiquement. Veuillez ne pas y
                        répondre directement.
                    </Text>

                    <Text className="text-gray-500 text-sm text-center">
                        © {new Date().getFullYear()} tabarro3. Tous droits
                        réservés.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default CampaignDigestEmail;
