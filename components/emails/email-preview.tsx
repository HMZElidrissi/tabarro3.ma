'use client';

import { sendCustomEmail, type DigestTestTemplate } from '@/actions/email';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { EmailData, PRESET_CONTENT } from '@/types/email';
import { generatePreviewHTML } from '@/lib/email-composer';
import EmailEditorPanel from './email-editor-panel';
import EmailPreviewPanel from './email-preview-panel';
import DigestTestForm from './digest-test-form';
import BloodRequestTestForm from './blood-request-test-form';
import { Button } from '@/components/ui/button';
import {
    CalendarDays,
    Droplets,
    Eye,
    EyeOff,
    LayoutTemplate,
    Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Template Gallery Items ───────────────────────────────────────────────────

const TEMPLATES: {
    id: DigestTestTemplate;
    label: string;
    description: string;
    icon: React.ReactNode;
    accent: string;
    activeAccent: string;
}[] = [
    {
        id: 'digest',
        label: 'Résumé Campagnes',
        description: 'Digest quotidien par région',
        icon: <CalendarDays className="w-4 h-4" />,
        accent: 'text-blue-600',
        activeAccent:
            'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    },
    {
        id: 'blood_request',
        label: 'Alerte Don de Sang',
        description: 'Demande urgente aux donneurs',
        icon: <Droplets className="w-4 h-4" />,
        accent: 'text-red-600',
        activeAccent:
            'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800',
    },
    {
        id: 'custom',
        label: 'Email Personnalisé',
        description: 'Message libre avec éditeur',
        icon: <Pencil className="w-4 h-4" />,
        accent: 'text-violet-600',
        activeAccent:
            'bg-violet-50 dark:bg-violet-950/40 border-violet-200 dark:border-violet-800',
    },
];

// ─── Quick Model Presets ──────────────────────────────────────────────────────

const QUICK_MODELS: {
    key: keyof typeof PRESET_CONTENT;
    label: string;
    emoji: string;
}[] = [
    { key: 'welcome', label: 'Bienvenue', emoji: '👋' },
    { key: 'invitation', label: 'Invitation', emoji: '✉️' },
    { key: 'urgent', label: 'Urgent', emoji: '🚨' },
    { key: 'campaign', label: 'Campagne', emoji: '📅' },
];

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmailPreview() {
    const [templateType, setTemplateType] =
        useState<DigestTestTemplate>('custom');

    // Digest state
    const [digestRegionId, setDigestRegionId] = useState(0);
    const [digestUseRealCampaigns, setDigestUseRealCampaigns] = useState(false);
    const [digestRecipientEmail, setDigestRecipientEmail] = useState('');
    const [digestPreviewHtml, setDigestPreviewHtml] = useState<string | null>(
        null,
    );
    const [digestSending, setDigestSending] = useState(false);

    // Blood request state
    const [bloodRequestId, setBloodRequestId] = useState<number | null>(null);
    const [bloodRequestRecipientEmail, setBloodRequestRecipientEmail] =
        useState('');
    const [bloodRequestPreviewHtml, setBloodRequestPreviewHtml] = useState<
        string | null
    >(null);
    const [bloodRequestSending, setBloodRequestSending] = useState(false);

    // Custom email state
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

    // Preview panel visibility
    const [showPreview, setShowPreview] = useState(true);

    const [openSections, setOpenSections] = useState({
        send: true,
        presets: true,
        content: true,
        highlight: false,
        logo: false,
        buttons: false,
        signature: false,
    });

    // ─── Handlers ────────────────────────────────────────────────────────────

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
            setEmailData(prev => ({ ...prev, [field]: value }));
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
        setEmailData(prev => ({ ...prev, ...content }));
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
                toast({ title: 'Succès!', description: result.message });
                setEmailData(prev => ({ ...prev, recipientEmail: '' }));
            } else {
                toast({
                    title: 'Erreur',
                    description: result.error,
                    variant: 'destructive',
                });
            }
        } catch {
            toast({
                title: 'Erreur',
                description: "Échec de l'envoi de l'email. Veuillez réessayer.",
                variant: 'destructive',
            });
        } finally {
            setIsSending(false);
        }
    };

    // ─── Active template meta ─────────────────────────────────────────────────

    const activeTemplate = TEMPLATES.find(t => t.id === templateType)!;

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
                {/* ── Left Sidebar: Template Gallery ────────────────────────── */}
                <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-black/20 flex flex-col gap-1 p-3 overflow-y-auto">
                    <div className="flex items-center gap-2 px-2 py-1 mb-1">
                        <LayoutTemplate className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Templates
                        </span>
                    </div>

                    {TEMPLATES.map(tpl => (
                        <button
                            key={tpl.id}
                            onClick={() => setTemplateType(tpl.id)}
                            className={cn(
                                'w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all duration-150',
                                templateType === tpl.id
                                    ? tpl.activeAccent + ' border-current'
                                    : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800/50 text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <span
                                className={cn(
                                    'mt-0.5',
                                    templateType === tpl.id ? tpl.accent : '',
                                )}
                            >
                                {tpl.icon}
                            </span>
                            <div className="min-w-0">
                                <div
                                    className={cn(
                                        'text-xs font-semibold leading-tight',
                                        templateType === tpl.id
                                            ? 'text-foreground'
                                            : '',
                                    )}
                                >
                                    {tpl.label}
                                </div>
                                <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                                    {tpl.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </aside>

                {/* ── Center Panel: Smart Form ───────────────────────────────── */}
                <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
                    {/* Quick Models strip — only shown for custom template */}
                    {templateType === 'custom' && (
                        <div className="px-5 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background sticky top-0 z-10">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                Modèles rapides
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {QUICK_MODELS.map(model => (
                                    <Button
                                        key={model.key}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => applyPreset(model.key)}
                                        className="h-8 px-3 text-xs gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <span>{model.emoji}</span>
                                        <span>{model.label}</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Template-specific form */}
                    <div className="flex-1 p-5">
                        {templateType === 'digest' && (
                            <DigestTestForm
                                regionId={digestRegionId}
                                useRealCampaigns={digestUseRealCampaigns}
                                recipientEmail={digestRecipientEmail}
                                onRegionIdChange={setDigestRegionId}
                                onUseRealCampaignsChange={
                                    setDigestUseRealCampaigns
                                }
                                onRecipientEmailChange={setDigestRecipientEmail}
                                onPreviewHtml={setDigestPreviewHtml}
                                isSending={digestSending}
                                onSendingChange={setDigestSending}
                            />
                        )}

                        {templateType === 'blood_request' && (
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
                        )}

                        {templateType === 'custom' && (
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
                        )}
                    </div>
                </main>

                {/* ── Right Panel: Floating Preview ──────────────────────────── */}
                {showPreview && (
                    <aside className="w-[520px] xl:w-[640px] shrink-0 border-l border-gray-200 dark:border-gray-800 bg-gray-50/40 dark:bg-black/10 flex flex-col overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-background">
                            <div className="flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                                <span className="text-xs font-semibold text-muted-foreground">
                                    Aperçu en temps réel
                                </span>
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                                    Live
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowPreview(false)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                                title="Masquer l'aperçu"
                            >
                                <EyeOff className="w-3.5 h-3.5" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <EmailPreviewPanel
                                templateType={templateType}
                                emailData={emailData}
                                digestPreviewHtml={digestPreviewHtml}
                                bloodRequestPreviewHtml={
                                    bloodRequestPreviewHtml
                                }
                            />
                        </div>
                    </aside>
                )}

                {/* Toggle button when preview is hidden */}
                {!showPreview && (
                    <button
                        onClick={() => setShowPreview(true)}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                        title="Afficher l'aperçu"
                    >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Aperçu</span>
                    </button>
                )}
            </div>
        </div>
    );
}
