import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface NearbyCampaignEmailProps {
    campaignName: string;
    organizationName?: string;
    date: string;
    time: string;
    location?: string;
    city?: string;
    description: string;
}

export const NearbyCampaignEmail = ({
    campaignName,
    organizationName,
    date,
    time,
    location,
    city,
    description,
}: NearbyCampaignEmailProps) => (
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
                        Campagne de don de sang près de chez vous
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        Une nouvelle campagne de don de sang est organisée
                        {city ? ` à ${city}` : ''} !
                    </Text>

                    <Section className="bg-gray-50 p-4 rounded-lg mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">
                            {campaignName}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            🏥 Organisé par : {organizationName}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            📅 Date : {date}
                        </Text>
                        {time && (
                            <Text className="text-gray-600 mb-2">
                                🕒 Horaire : {time}
                            </Text>
                        )}
                        {location && (
                            <Text className="text-gray-600 mb-2">
                                📍 Lieu : {location}
                            </Text>
                        )}
                        {city && (
                            <Text className="text-gray-600 mb-2">
                                🏢 Ville : {city}
                            </Text>
                        )}
                        <Text className="text-gray-600">
                            ℹ️ Description : {description}
                        </Text>
                    </Section>

                    <Section className="text-center my-8">
                        <Button
                            href="https://www.tabarro3.ma/campaigns"
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors">
                            Je participe
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        Votre don peut sauver jusqu'à trois vies. N'oubliez pas
                        de :
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-2">
                        • Bien manger et vous hydrater avant le don
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-2">
                        • Apporter une pièce d'identité
                    </Text>
                    <Text className="text-gray-500 text-base ml-6 mb-4">
                        • Prévoir environ 45 minutes pour l'ensemble du
                        processus
                    </Text>

                    <Hr className="border-gray-200 my-8" />

                    <Text className="text-gray-500 text-sm text-center">
                        © {new Date().getFullYear()} tabarro3. Tous droits
                        réservés.
                    </Text>
                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default NearbyCampaignEmail;
