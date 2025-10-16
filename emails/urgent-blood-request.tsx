import {
    Body,
    Button,
    Container,
    Head,
    Html,
    Section,
    Text,
    Img,
    Hr,
    Tailwind,
} from '@react-email/components';
import * as React from 'react';

interface UrgentBloodRequestEmailProps {
    bloodGroup: string;
    location: string;
    city: string;
    phone?: string;
    description: string;
}

export const UrgentBloodRequestEmail = ({
    bloodGroup,
    location,
    city,
    phone,
    description,
}: UrgentBloodRequestEmailProps) => (
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
            }}
        >
            <Body className="bg-gray-50 py-10">
                <Container className="bg-white rounded-lg shadow-lg mx-auto p-8 max-w-[580px]">
                    <Section className="text-center mb-8">
                        <Img
                            src="https://www.tabarro3.ma/logo.png"
                            width="140"
                            height="auto"
                            alt="tabarro3"
                            className="mx-auto"
                        />
                    </Section>

                    <Text className="text-2xl font-bold text-brand-600 text-center mb-6">
                        BESOIN URGENT DE SANG
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        Un donneur de sang du groupe {bloodGroup} est urgemment
                        recherché. Votre sang est compatible et peut sauver une
                        vie !
                    </Text>

                    <Section className="bg-gray-50 p-4 rounded-lg mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">
                            Détails de la demande :
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            🩸 Groupe sanguin : {bloodGroup}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            📍 Lieu : {location}
                        </Text>
                        <Text className="text-gray-600 mb-2">
                            🏢 Ville : {city}
                        </Text>
                        {phone && (
                            <Text className="text-gray-600">
                                📞 Contact : {phone}
                            </Text>
                        )}
                        <Text className="text-gray-600">
                            ℹ️ Description : {description}
                        </Text>
                    </Section>

                    <Section className="text-center my-8">
                        <Button
                            href="https://www.tabarro3.ma/requests"
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            Voir les détails
                        </Button>
                    </Section>

                    <Text className="text-gray-600 text-base mb-4">
                        Si vous ne pouvez pas donner, merci de partager cette
                        demande avec votre entourage. Chaque partage peut aider
                        à sauver une vie.
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

export default UrgentBloodRequestEmail;
