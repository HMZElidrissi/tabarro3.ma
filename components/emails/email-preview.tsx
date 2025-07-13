'use client';

import { sendCustomEmail } from '@/actions/email';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import {
    ChevronDown,
    ChevronUp,
    Copy,
    Eye,
    FileText,
    Image,
    Loader2,
    Mail,
    Monitor,
    MousePointer,
    Plus,
    Send,
    Signature,
    Smartphone,
    Square,
    Tablet,
    Trash2,
    Type,
} from 'lucide-react';
import { useState } from 'react';

interface EmailData {
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

const PRESET_CONTENT = {
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

export default function EmailPreview() {
    const [emailData, setEmailData] = useState<EmailData>({
        showLogo: true,
        logoUrl: 'https://www.tabarro3.ma/logo.png',
        logoWidth: 140,
        title: 'Bienvenue sur tabarro3!',
        greeting: 'Cher nouveau membre,',
        message:
            'Nous sommes ravis de vous accueillir dans notre communauté de donneurs de sang. Ensemble, nous pouvons sauver des vies et faire la différence.',
        showHighlight: false,
        highlightTitle: 'Informations importantes',
        highlightContent:
            '🩸 Groupe sanguin recherché: O+\n📍 Lieu: Hôpital Ibn Sina, Rabat\n📞 Contact: +212 5XX-XXXXXX',
        highlightIcon: '🩸',
        primaryButton: {
            enabled: true,
            text: 'Commencer',
            url: 'https://tabarro3.ma/dashboard',
            style: 'primary',
        },
        secondaryButton: {
            enabled: false,
            text: 'En savoir plus',
            url: 'https://tabarro3.ma/about',
            style: 'outline',
        },
        additionalContent: '',
        showSignature: true,
        signature: "Cordialement,\nL'équipe tabarro3",
        showFooter: true,
        footerText: '',
        showCopyright: true,
        customFooterLinks: [],
        recipientEmail: '',
        subject: 'Bienvenue sur tabarro3',
    });
    const [isSending, setIsSending] = useState(false);
    const [previewDevice, setPreviewDevice] = useState<
        'desktop' | 'tablet' | 'mobile'
    >('desktop');

    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        presets: true,
        logo: true,
        content: true,
        highlight: false,
        buttons: true,
        signature: false,
        send: true,
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleInputChange = (field: string, value: any) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setEmailData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof EmailData] as any),
                    [child]: value,
                },
            }));
        } else {
            setEmailData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const addFooterLink = () => {
        setEmailData(prev => ({
            ...prev,
            customFooterLinks: [
                ...prev.customFooterLinks,
                { text: '', url: '' },
            ],
        }));
    };

    const removeFooterLink = (index: number) => {
        setEmailData(prev => ({
            ...prev,
            customFooterLinks: prev.customFooterLinks.filter(
                (_, i) => i !== index,
            ),
        }));
    };

    const updateFooterLink = (
        index: number,
        field: 'text' | 'url',
        value: string,
    ) => {
        setEmailData(prev => ({
            ...prev,
            customFooterLinks: prev.customFooterLinks.map((link, i) =>
                i === index ? { ...link, [field]: value } : link,
            ),
        }));
    };

    const applyPreset = (preset: keyof typeof PRESET_CONTENT) => {
        const content = PRESET_CONTENT[preset];
        setEmailData(prev => ({
            ...prev,
            ...content,
        }));
    };

    const handleSendEmail = async () => {
        if (!emailData.recipientEmail) {
            toast({
                title: 'Erreur',
                description:
                    'Veuillez entrer une adresse email de destinataire.',
                variant: 'destructive',
            });
            return;
        }

        setIsSending(true);
        try {
            const result = await sendCustomEmail(emailData);

            if (result.success) {
                toast({
                    title: 'Succès!',
                    description: result.message,
                });
                setEmailData(prev => ({ ...prev, recipientEmail: '' }));
            } else {
                toast({
                    title: 'Erreur',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        } catch (error) {
            toast({
                title: 'Erreur',
                description: "Échec de l'envoi de l'email. Veuillez réessayer.",
                variant: 'destructive',
            });
        } finally {
            setIsSending(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatePreviewHTML(emailData));
            toast({
                title: 'Copié!',
                description: 'HTML copié dans le presse-papier.',
            });
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de copier le HTML.',
                variant: 'destructive',
            });
        }
    };

    const getPreviewWidth = () => {
        switch (previewDevice) {
            case 'mobile':
                return 'max-w-sm';
            case 'tablet':
                return 'max-w-md';
            default:
                return 'max-w-2xl';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/30 dark:bg-black">
            {/* Header */}
            <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                                <Mail className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                    Créateur d'Email
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Créez des emails personnalisés avec aperçu
                                    en temps réel
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                className="hidden sm:flex dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
                                <Copy className="w-4 h-4 mr-2" />
                                Copier HTML
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Edit Panel */}
                    <div className="lg:col-span-2">
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <div className="space-y-4 pr-4">
                                {/* Quick Presets */}
                                <Collapsible
                                    open={openSections.presets}
                                    onOpenChange={() =>
                                        toggleSection('presets')
                                    }>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Type className="w-4 h-4 text-blue-600" />
                                                        Modèles rapides
                                                    </div>
                                                    {openSections.presets ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {Object.entries(
                                                        PRESET_CONTENT,
                                                    ).map(([key, preset]) => (
                                                        <Button
                                                            key={key}
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                applyPreset(
                                                                    key as keyof typeof PRESET_CONTENT,
                                                                )
                                                            }
                                                            className="h-auto p-3 text-left justify-start">
                                                            <div className="flex flex-col items-start">
                                                                <div className="text-xs font-medium">
                                                                    {key ===
                                                                        'welcome' &&
                                                                        '👋 Bienvenue'}
                                                                    {key ===
                                                                        'invitation' &&
                                                                        '✉️ Invitation'}
                                                                    {key ===
                                                                        'urgent' &&
                                                                        '🚨 Urgent'}
                                                                    {key ===
                                                                        'campaign' &&
                                                                        '📅 Campagne'}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                                    {
                                                                        preset.title
                                                                    }
                                                                </div>
                                                            </div>
                                                        </Button>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Logo Options */}
                                <Collapsible
                                    open={openSections.logo}
                                    onOpenChange={() => toggleSection('logo')}>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Image className="w-4 h-4 text-purple-600" />
                                                        Logo et branding
                                                    </div>
                                                    {openSections.logo ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Afficher le logo
                                                    </Label>
                                                    <Switch
                                                        checked={
                                                            emailData.showLogo
                                                        }
                                                        onCheckedChange={checked =>
                                                            handleInputChange(
                                                                'showLogo',
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {emailData.showLogo && (
                                                    <div className="space-y-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                URL du logo
                                                            </Label>
                                                            <Input
                                                                value={
                                                                    emailData.logoUrl
                                                                }
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        'logoUrl',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="https://example.com/logo.png"
                                                                className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                Largeur (px)
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                value={
                                                                    emailData.logoWidth
                                                                }
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        'logoWidth',
                                                                        parseInt(
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        ),
                                                                    )
                                                                }
                                                                min="50"
                                                                max="300"
                                                                className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Content */}
                                <Collapsible
                                    open={openSections.content}
                                    onOpenChange={() =>
                                        toggleSection('content')
                                    }>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-green-600" />
                                                        Contenu principal
                                                    </div>
                                                    {openSections.content ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Titre de l'email
                                                    </Label>
                                                    <Input
                                                        value={emailData.title}
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'title',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Titre principal"
                                                        className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Salutation
                                                    </Label>
                                                    <Input
                                                        value={
                                                            emailData.greeting
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'greeting',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Cher/Chère..."
                                                        className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Message principal
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            emailData.message
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'message',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Votre message principal..."
                                                        rows={4}
                                                        className="resize-none dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Contenu supplémentaire
                                                    </Label>
                                                    <Textarea
                                                        value={
                                                            emailData.additionalContent
                                                        }
                                                        onChange={e =>
                                                            handleInputChange(
                                                                'additionalContent',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Contenu additionnel..."
                                                        rows={3}
                                                        className="resize-none dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                    />
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Highlight Box */}
                                <Collapsible
                                    open={openSections.highlight}
                                    onOpenChange={() =>
                                        toggleSection('highlight')
                                    }>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Square className="w-4 h-4 text-orange-600" />
                                                        Encadré d'information
                                                        {emailData.showHighlight && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs dark:bg-gray-800 dark:text-gray-300">
                                                                Actif
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {openSections.highlight ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        Afficher l'encadré
                                                    </Label>
                                                    <Switch
                                                        checked={
                                                            emailData.showHighlight
                                                        }
                                                        onCheckedChange={checked =>
                                                            handleInputChange(
                                                                'showHighlight',
                                                                checked,
                                                            )
                                                        }
                                                    />
                                                </div>

                                                {emailData.showHighlight && (
                                                    <div className="space-y-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    Icône
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        emailData.highlightIcon
                                                                    }
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            'highlightIcon',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="🩸"
                                                                    className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    Titre
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        emailData.highlightTitle
                                                                    }
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            'highlightTitle',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Titre"
                                                                    className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                Contenu
                                                            </Label>
                                                            <Textarea
                                                                value={
                                                                    emailData.highlightContent
                                                                }
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        'highlightContent',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Informations détaillées..."
                                                                rows={3}
                                                                className="resize-none dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Buttons */}
                                <Collapsible
                                    open={openSections.buttons}
                                    onOpenChange={() =>
                                        toggleSection('buttons')
                                    }>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <MousePointer className="w-4 h-4 text-blue-600" />
                                                        Boutons d'action
                                                        {(emailData
                                                            .primaryButton
                                                            .enabled ||
                                                            emailData
                                                                .secondaryButton
                                                                .enabled) && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs dark:bg-gray-800 dark:text-gray-300">
                                                                {
                                                                    [
                                                                        emailData
                                                                            .primaryButton
                                                                            .enabled,
                                                                        emailData
                                                                            .secondaryButton
                                                                            .enabled,
                                                                    ].filter(
                                                                        Boolean,
                                                                    ).length
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {openSections.buttons ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                {/* Primary Button */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Bouton principal
                                                        </Label>
                                                        <Switch
                                                            checked={
                                                                emailData
                                                                    .primaryButton
                                                                    .enabled
                                                            }
                                                            onCheckedChange={checked =>
                                                                handleInputChange(
                                                                    'primaryButton.enabled',
                                                                    checked,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {emailData.primaryButton
                                                        .enabled && (
                                                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        Texte
                                                                    </Label>
                                                                    <Input
                                                                        value={
                                                                            emailData
                                                                                .primaryButton
                                                                                .text
                                                                        }
                                                                        onChange={e =>
                                                                            handleInputChange(
                                                                                'primaryButton.text',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Texte du bouton"
                                                                        className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        Style
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            emailData
                                                                                .primaryButton
                                                                                .style
                                                                        }
                                                                        onValueChange={value =>
                                                                            handleInputChange(
                                                                                'primaryButton.style',
                                                                                value,
                                                                            )
                                                                        }>
                                                                        <SelectTrigger className="h-9 dark:bg-black dark:border-gray-800">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50">
                                                                            <SelectItem value="primary">
                                                                                🔴
                                                                                Principal
                                                                            </SelectItem>
                                                                            <SelectItem value="secondary">
                                                                                ⚫
                                                                                Secondaire
                                                                            </SelectItem>
                                                                            <SelectItem value="outline">
                                                                                ⭕
                                                                                Contour
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    URL
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        emailData
                                                                            .primaryButton
                                                                            .url
                                                                    }
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            'primaryButton.url',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="https://..."
                                                                    className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Secondary Button */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Bouton secondaire
                                                        </Label>
                                                        <Switch
                                                            checked={
                                                                emailData
                                                                    .secondaryButton
                                                                    .enabled
                                                            }
                                                            onCheckedChange={checked =>
                                                                handleInputChange(
                                                                    'secondaryButton.enabled',
                                                                    checked,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {emailData.secondaryButton
                                                        .enabled && (
                                                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        Texte
                                                                    </Label>
                                                                    <Input
                                                                        value={
                                                                            emailData
                                                                                .secondaryButton
                                                                                .text
                                                                        }
                                                                        onChange={e =>
                                                                            handleInputChange(
                                                                                'secondaryButton.text',
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        placeholder="Texte du bouton"
                                                                        className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        Style
                                                                    </Label>
                                                                    <Select
                                                                        value={
                                                                            emailData
                                                                                .secondaryButton
                                                                                .style
                                                                        }
                                                                        onValueChange={value =>
                                                                            handleInputChange(
                                                                                'secondaryButton.style',
                                                                                value,
                                                                            )
                                                                        }>
                                                                        <SelectTrigger className="h-9 dark:bg-black dark:border-gray-800">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="dark:bg-gray-950 dark:border-gray-800 dark:text-gray-50">
                                                                            <SelectItem value="primary">
                                                                                🔴
                                                                                Principal
                                                                            </SelectItem>
                                                                            <SelectItem value="secondary">
                                                                                ⚫
                                                                                Secondaire
                                                                            </SelectItem>
                                                                            <SelectItem value="outline">
                                                                                ⭕
                                                                                Contour
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-200">
                                                                    URL
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        emailData
                                                                            .secondaryButton
                                                                            .url
                                                                    }
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            'secondaryButton.url',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="https://..."
                                                                    className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Signature & Footer */}
                                <Collapsible
                                    open={openSections.signature}
                                    onOpenChange={() =>
                                        toggleSection('signature')
                                    }>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Signature className="w-4 h-4 text-indigo-600" />
                                                        Signature et pied de
                                                        page
                                                        {(emailData.showSignature ||
                                                            emailData.showFooter) && (
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs dark:bg-gray-800 dark:text-gray-300">
                                                                {
                                                                    [
                                                                        emailData.showSignature,
                                                                        emailData.showFooter,
                                                                    ].filter(
                                                                        Boolean,
                                                                    ).length
                                                                }
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {openSections.signature ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                {/* Signature */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Afficher la
                                                            signature
                                                        </Label>
                                                        <Switch
                                                            checked={
                                                                emailData.showSignature
                                                            }
                                                            onCheckedChange={checked =>
                                                                handleInputChange(
                                                                    'showSignature',
                                                                    checked,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {emailData.showSignature && (
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                Signature
                                                            </Label>
                                                            <Textarea
                                                                value={
                                                                    emailData.signature
                                                                }
                                                                onChange={e =>
                                                                    handleInputChange(
                                                                        'signature',
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="Cordialement,..."
                                                                rows={2}
                                                                className="resize-none dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                                <Separator />

                                                {/* Footer */}
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Afficher le pied de
                                                            page
                                                        </Label>
                                                        <Switch
                                                            checked={
                                                                emailData.showFooter
                                                            }
                                                            onCheckedChange={checked =>
                                                                handleInputChange(
                                                                    'showFooter',
                                                                    checked,
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {emailData.showFooter && (
                                                        <div className="space-y-3 p-3 bg-gray-50 dark:bg-black rounded-lg">
                                                            <div className="space-y-2">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    Texte du
                                                                    pied de page
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        emailData.footerText
                                                                    }
                                                                    onChange={e =>
                                                                        handleInputChange(
                                                                            'footerText',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    placeholder="Texte additionnel"
                                                                    className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                                />
                                                            </div>

                                                            <div className="flex items-center justify-between">
                                                                <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                    Afficher le
                                                                    copyright
                                                                </Label>
                                                                <Switch
                                                                    checked={
                                                                        emailData.showCopyright
                                                                    }
                                                                    onCheckedChange={checked =>
                                                                        handleInputChange(
                                                                            'showCopyright',
                                                                            checked,
                                                                        )
                                                                    }
                                                                />
                                                            </div>

                                                            {/* Custom Footer Links */}
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                                        Liens du
                                                                        pied de
                                                                        page
                                                                    </Label>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={
                                                                            addFooterLink
                                                                        }
                                                                        className="h-7 text-xs">
                                                                        <Plus className="w-3 h-3 mr-1" />
                                                                        Ajouter
                                                                    </Button>
                                                                </div>

                                                                {emailData.customFooterLinks.map(
                                                                    (
                                                                        link,
                                                                        index,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex gap-2 items-end">
                                                                            <div className="flex-1 space-y-1">
                                                                                <Label className="text-xs">
                                                                                    Texte
                                                                                </Label>
                                                                                <Input
                                                                                    value={
                                                                                        link.text
                                                                                    }
                                                                                    onChange={e =>
                                                                                        updateFooterLink(
                                                                                            index,
                                                                                            'text',
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    placeholder="Texte du lien"
                                                                                    className="h-8 text-xs dark:bg-black dark:border-gray-800"
                                                                                />
                                                                            </div>
                                                                            <div className="flex-1 space-y-1">
                                                                                <Label className="text-xs">
                                                                                    URL
                                                                                </Label>
                                                                                <Input
                                                                                    value={
                                                                                        link.url
                                                                                    }
                                                                                    onChange={e =>
                                                                                        updateFooterLink(
                                                                                            index,
                                                                                            'url',
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                    placeholder="https://..."
                                                                                    className="h-8 text-xs dark:bg-black dark:border-gray-800"
                                                                                />
                                                                            </div>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={() =>
                                                                                    removeFooterLink(
                                                                                        index,
                                                                                    )
                                                                                }
                                                                                className="h-8 w-8 p-0">
                                                                                <Trash2 className="w-3 h-3" />
                                                                            </Button>
                                                                        </div>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>

                                {/* Send Email Section */}
                                <Collapsible
                                    open={openSections.send}
                                    onOpenChange={() => toggleSection('send')}>
                                    <Card className="dark:bg-gray-950 dark:border-gray-800">
                                        <CollapsibleTrigger asChild>
                                            <CardHeader className="cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-900 transition-colors">
                                                <CardTitle className="text-sm flex items-center justify-between dark:text-gray-50">
                                                    <div className="flex items-center gap-2">
                                                        <Send className="w-4 h-4 text-red-600" />
                                                        Envoyer l'email
                                                    </div>
                                                    {openSections.send ? (
                                                        <ChevronUp className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" />
                                                    )}
                                                </CardTitle>
                                            </CardHeader>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <CardContent className="pt-0 space-y-4">
                                                <div className="space-y-3">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Sujet
                                                        </Label>
                                                        <Input
                                                            value={
                                                                emailData.subject
                                                            }
                                                            onChange={e =>
                                                                handleInputChange(
                                                                    'subject',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Sujet de l'email"
                                                            className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            Email du
                                                            destinataire
                                                        </Label>
                                                        <Input
                                                            type="email"
                                                            value={
                                                                emailData.recipientEmail
                                                            }
                                                            onChange={e =>
                                                                handleInputChange(
                                                                    'recipientEmail',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="destinataire@exemple.com"
                                                            className="h-9 dark:bg-black dark:border-gray-800 dark:text-gray-200"
                                                        />
                                                    </div>
                                                </div>

                                                <Button
                                                    onClick={handleSendEmail}
                                                    disabled={
                                                        isSending ||
                                                        !emailData.recipientEmail
                                                    }
                                                    className="w-full h-10">
                                                    {isSending ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Envoi en cours...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4 mr-2" />
                                                            Envoyer l'email
                                                        </>
                                                    )}
                                                </Button>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Card>
                                </Collapsible>
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Live Preview Panel */}
                    <div className="lg:col-span-3">
                        <div className="sticky top-24">
                            <Card className="dark:bg-gray-950 dark:border-gray-800">
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            <div>
                                                <CardTitle className="text-sm dark:text-gray-50">
                                                    Aperçu en temps réel
                                                </CardTitle>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-black rounded-lg">
                                                <Button
                                                    variant={
                                                        previewDevice ===
                                                        'mobile'
                                                            ? 'default'
                                                            : 'ghost'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setPreviewDevice(
                                                            'mobile',
                                                        )
                                                    }
                                                    className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                                    <Smartphone className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant={
                                                        previewDevice ===
                                                        'tablet'
                                                            ? 'default'
                                                            : 'ghost'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setPreviewDevice(
                                                            'tablet',
                                                        )
                                                    }
                                                    className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                                    <Tablet className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    variant={
                                                        previewDevice ===
                                                        'desktop'
                                                            ? 'default'
                                                            : 'ghost'
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        setPreviewDevice(
                                                            'desktop',
                                                        )
                                                    }
                                                    className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                                    <Monitor className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="border-t border-gray-200 dark:border-gray-700">
                                        <div className="bg-gray-50 dark:bg-black p-4 h-[calc(100vh-300px)] overflow-auto">
                                            <div
                                                className={`mx-auto bg-white dark:bg-gray-950 rounded-lg shadow-sm transition-all duration-300 ${getPreviewWidth()}`}>
                                                {/* Email Client Header */}
                                                <div className="border-b border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-black rounded-t-lg">
                                                    <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                            <span>
                                                                De:
                                                                noreply@tabarro3.ma
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span>
                                                                À:{' '}
                                                                {emailData.recipientEmail ||
                                                                    'destinataire@exemple.com'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-2 text-xs text-gray-800 dark:text-gray-200 font-medium">
                                                        {emailData.subject}
                                                    </div>
                                                </div>

                                                {/* Email Content */}
                                                <div
                                                    className="email-preview"
                                                    style={{
                                                        fontFamily:
                                                            'Arial, sans-serif',
                                                    }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: generatePreviewHTML(
                                                            emailData,
                                                            document
                                                                .querySelector(
                                                                    'html',
                                                                )
                                                                ?.classList.contains(
                                                                    'dark',
                                                                ),
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper function to generate preview HTML
function generatePreviewHTML(data: EmailData, isDarkMode = false): string {
    const colors = {
        bg: isDarkMode ? '#000000' : '#f9fafb',
        containerBg: isDarkMode ? '#030712' : '#ffffff',
        text: isDarkMode ? '#f9fafb' : '#111827',
        subtext: isDarkMode ? '#d1d5db' : '#4b5563',
        footerText: isDarkMode ? '#9ca3af' : '#6b7280',
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        highlightBg: isDarkMode ? '#000000' : '#f9fafb',
        highlightText: isDarkMode ? '#e5e7eb' : '#374151',
    };

    let html = `<div style="background: ${colors.bg}; padding: 40px;">`;
    html += `<div style="max-width: 600px; margin: 0 auto; background: ${colors.containerBg}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); padding: 32px; font-family: Arial, sans-serif;">`;

    // Header with logo
    if (data.showLogo) {
        html += `<div style="text-align: center; margin-bottom: 32px;">`;
        html += `<img src="${data.logoUrl}" width="${data.logoWidth}" alt="logo" style="margin: 0 auto;" />`;
        html += `</div>`;
    }

    // Title
    html += `<h1 style="text-align: center; font-size: 24px; font-weight: bold; color: ${colors.text}; margin-bottom: 24px;">${data.title}</h1>`;

    // Content
    html += `<p style="color: ${colors.subtext}; margin-bottom: 16px; text-align: center;">${data.greeting}</p>`;
    html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: center;">${data.message}</p>`;

    // Highlight box
    if (data.showHighlight && data.highlightContent) {
        html += `<div style="background: ${colors.highlightBg}; padding: 24px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #e22021;">`;
        if (data.highlightTitle) {
            html += `<p style="color: ${colors.highlightText}; font-weight: 600; margin-bottom: 12px; text-align: left;">${data.highlightIcon} ${data.highlightTitle}</p>`;
        }
        html += `<p style="color: ${colors.subtext}; margin: 0; text-align: left; white-space: pre-wrap;">${data.highlightContent}</p>`;
        html += `</div>`;
    }

    // Additional content
    if (data.additionalContent) {
        html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: center;">${data.additionalContent}</p>`;
    }

    // Buttons
    if (data.primaryButton.enabled || data.secondaryButton.enabled) {
        html += `<div style="margin: 32px 0; text-align: center;">`;
        if (data.primaryButton.enabled) {
            const buttonStyle = getButtonStyle(data.primaryButton.style);
            html += `<a href="${data.primaryButton.url}" style="${buttonStyle} padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block; margin-right: 12px;">${data.primaryButton.text}</a>`;
        }
        if (data.secondaryButton.enabled) {
            const buttonStyle = getButtonStyle(data.secondaryButton.style);
            html += `<a href="${data.secondaryButton.url}" style="${buttonStyle} padding: 12px 24px; border-radius: 6px; font-weight: 600; text-decoration: none; display: inline-block;">${data.secondaryButton.text}</a>`;
        }
        html += `</div>`;
    }

    // Signature
    if (data.showSignature && data.signature) {
        html += `<p style="color: ${colors.subtext}; margin-bottom: 24px; white-space: pre-wrap; text-align: center;">${data.signature}</p>`;
    }

    // Footer
    if (data.showFooter) {
        html += `<hr style="border: none; border-top: 1px solid ${colors.borderColor}; margin: 32px 0;" />`;

        if (data.footerText) {
            html += `<p style="color: ${colors.footerText}; font-size: 14px; text-align: center; margin-bottom: 16px;">${data.footerText}</p>`;
        }

        if (data.customFooterLinks.length > 0) {
            html += `<div style="text-align: center; margin-bottom: 16px;">`;
            data.customFooterLinks.forEach((link, index) => {
                html += `<a href="${link.url}" style="color: #e22021; font-size: 14px; text-decoration: none; margin: 0 8px;">${link.text}</a>`;
                if (index < data.customFooterLinks.length - 1) {
                    html += `<span style="color: #9ca3af; margin: 0 4px;">|</span>`;
                }
            });
            html += `</div>`;
        }

        if (data.showCopyright) {
            html += `<p style="color: ${colors.footerText}; font-size: 14px; text-align: center;">© ${new Date().getFullYear()} tabarro3. Tous droits réservés.</p>`;
        }
    }

    html += `</div></div>`;
    return html;
}

function getButtonStyle(style: string): string {
    switch (style) {
        case 'primary':
            return 'background: #e22021; color: white; border: 1px solid #e22021;';
        case 'secondary':
            return 'background: #4b5563; color: white; border: 1px solid #4b5563;';
        case 'outline':
            return 'background: transparent; color: #e22021; border: 2px solid #e22021;';
        default:
            return 'background: #e22021; color: white; border: 1px solid #e22021;';
    }
}
