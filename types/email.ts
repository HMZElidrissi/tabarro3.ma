export interface EmailData {
    // Logo options
    showLogo: boolean;
    logoUrl: string;
    logoWidth: number;

    // Content
    title: string;
    greeting: string;
    message: string;

    // Highlight box
    showHighlight: boolean;
    highlightTitle: string;
    highlightContent: string;
    highlightIcon: string;

    // Buttons
    primaryButton: {
        enabled: boolean;
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };
    secondaryButton: {
        enabled: boolean;
        text: string;
        url: string;
        style: 'primary' | 'secondary' | 'outline';
    };

    // Additional content
    additionalContent: string;
    showSignature: boolean;
    signature: string;

    // Footer
    showFooter: boolean;
    footerText: string;
    showCopyright: boolean;
    customFooterLinks: Array<{ text: string; url: string }>;

    // Email meta
    recipientEmail: string;
    subject: string;
}

export const PRESET_CONTENT = {
    welcome: {
        title: 'Bienvenue sur tabarro3!',
        greeting: 'Cher nouveau membre,',
        message:
            'Nous sommes ravis de vous accueillir dans notre communauté de donneurs de sang. Ensemble, nous pouvons sauver des vies et faire la différence.',
        signature: "Cordialement,\nL'équipe tabarro3",
    },
    invitation: {
        title: 'Invitation à rejoindre tabarro3',
        greeting: 'Cher partenaire potentiel,',
        message:
            'Nous vous invitons à rejoindre tabarro3, une plateforme innovante dédiée à la promotion du don de sang au Maroc. Votre participation serait précieuse pour notre mission commune.',
        signature: "Avec nos salutations distinguées,\nL'équipe tabarro3",
    },
    urgent: {
        title: 'BESOIN URGENT DE SANG',
        greeting: 'Chers donneurs,',
        message:
            "Un patient a un besoin urgent de sang. Votre don peut sauver une vie dès aujourd'hui.",
        signature: "Merci pour votre générosité,\nL'équipe tabarro3",
    },
    campaign: {
        title: 'Nouvelle campagne de don',
        greeting: 'Bonjour,',
        message:
            "Une nouvelle campagne de don de sang aura lieu près de chez vous. C'est l'occasion parfaite de contribuer à sauver des vies.",
        signature: "À bientôt,\nL'équipe tabarro3",
    },
};
