'use client';

import { sendCustomEmail, type DigestTestTemplate } from '@/actions/email';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { EmailData, PRESET_CONTENT } from '@/types/email';
import { generatePreviewHTML } from '@/lib/email-composer';
import EmailEditorHeader from './email-editor-header';
import EmailEditorPanel from './email-editor-panel';
import EmailPreviewPanel from './email-preview-panel';
import DigestTestForm from './digest-test-form';
import BloodRequestTestForm from './blood-request-test-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function EmailPreview() {
    const [templateType, setTemplateType] =
        useState<DigestTestTemplate>('custom');
    const [digestRegionId, setDigestRegionId] = useState(0);
    const [digestUseRealCampaigns, setDigestUseRealCampaigns] = useState(false);
    const [digestRecipientEmail, setDigestRecipientEmail] = useState('');
    const [digestPreviewHtml, setDigestPreviewHtml] = useState<string | null>(
        null,
    );
    const [digestSending, setDigestSending] = useState(false);

    const [bloodRequestId, setBloodRequestId] = useState<number | null>(null);
    const [bloodRequestRecipientEmail, setBloodRequestRecipientEmail] =
        useState('');
    const [bloodRequestPreviewHtml, setBloodRequestPreviewHtml] = useState<
        string | null
    >(null);
    const [bloodRequestSending, setBloodRequestSending] = useState(false);

    const [emailData, setEmailData] = useState<EmailData>({
        showLogo: true,
        logoUrl: 'https://tabarro3.ma/logo.png',
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
    const [previewDevice, setPreviewDeviceAction] = useState<
        'desktop' | 'tablet' | 'mobile'
    >('desktop');

    const [openSections, setOpenSections] = useState({
        send: true,
        presets: true,
        content: true,
        highlight: false,
        logo: false,
        buttons: false,
        signature: false,
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

    return (
        <div className="min-h-screen">
            <EmailEditorHeader
                onCopy={copyToClipboard}
                showCopyButton={templateType === 'custom'}
            />

            <div className="container mx-auto p-6">
                <Tabs
                    value={templateType}
                    onValueChange={v =>
                        setTemplateType(v as DigestTestTemplate)
                    }
                    className="space-y-4"
                >
                    <TabsList className="grid w-full max-w-2xl grid-cols-3">
                        <TabsTrigger value="digest">
                            Résumé campagnes
                        </TabsTrigger>
                        <TabsTrigger value="blood_request">
                            Demande urgente sang
                        </TabsTrigger>
                        <TabsTrigger value="custom">
                            Email personnalisé
                        </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-2">
                            <TabsContent value="digest" className="mt-0">
                                <DigestTestForm
                                    regionId={digestRegionId}
                                    useRealCampaigns={digestUseRealCampaigns}
                                    recipientEmail={digestRecipientEmail}
                                    onRegionIdChange={setDigestRegionId}
                                    onUseRealCampaignsChange={
                                        setDigestUseRealCampaigns
                                    }
                                    onRecipientEmailChange={
                                        setDigestRecipientEmail
                                    }
                                    onPreviewHtml={setDigestPreviewHtml}
                                    isSending={digestSending}
                                    onSendingChange={setDigestSending}
                                />
                            </TabsContent>
                            <TabsContent value="blood_request" className="mt-0">
                                <BloodRequestTestForm
                                    requestId={bloodRequestId}
                                    recipientEmail={bloodRequestRecipientEmail}
                                    onRequestIdChange={setBloodRequestId}
                                    onRecipientEmailChange={
                                        setBloodRequestRecipientEmail
                                    }
                                    onPreviewHtml={setBloodRequestPreviewHtml}
                                    isSending={bloodRequestSending}
                                    onSendingChange={setBloodRequestSending}
                                />
                            </TabsContent>
                            <TabsContent value="custom" className="mt-0">
                                <EmailEditorPanel
                                    emailData={emailData}
                                    openSections={openSections}
                                    isSending={isSending}
                                    onInputChange={handleInputChange}
                                    onApplyPreset={applyPreset}
                                    onToggleSection={toggleSection}
                                    onAddFooterLink={addFooterLink}
                                    onRemoveFooterLink={removeFooterLink}
                                    onUpdateFooterLink={updateFooterLink}
                                    onSendEmail={handleSendEmail}
                                />
                            </TabsContent>
                        </div>

                        <div className="lg:col-span-3">
                            <EmailPreviewPanel
                                templateType={templateType}
                                emailData={emailData}
                                previewDevice={previewDevice}
                                setPreviewDeviceAction={setPreviewDeviceAction}
                                digestPreviewHtml={digestPreviewHtml}
                                bloodRequestPreviewHtml={
                                    bloodRequestPreviewHtml
                                }
                            />
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
