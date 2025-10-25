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

export const PasswordChangedEmail = () => (
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
                            src="https://tabarro3.ma/logo.png"
                            width="140"
                            height="auto"
                            alt="tabarro3"
                            className="mx-auto"
                        />
                    </Section>

                    <Text className="text-2xl font-bold text-gray-900 text-center mb-6">
                        Mot de passe modifié avec succès
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        Bonjour,
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        Cet email confirme que votre mot de passe a été modifié
                        avec succès.
                    </Text>

                    <Text className="text-gray-600 text-base mb-4">
                        Si vous n'êtes pas à l'origine de ce changement,
                        veuillez contacter notre équipe support immédiatement :
                    </Text>

                    <Section className="text-center my-8">
                        <Button
                            href="mailto:dondesang.ma@gmail.com"
                            className="bg-brand-600 hover:bg-brand-700 active:bg-brand-800 focus:outline-none focus:border-brand-900 focus:ring ring-brand-300 text-white shadow px-6 py-3 rounded-md font-semibold text-base inline-block transition-colors"
                        >
                            Contacter le support
                        </Button>
                    </Section>

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

export default PasswordChangedEmail;
