'use client';

import { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, RefreshCw } from 'lucide-react';
import {
    getRegionsForDigest,
    getDigestPreviewHtml,
    sendTestDigestEmail,
} from '@/actions/email';
import { useToast } from '@/hooks/use-toast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DigestTestFormProps {
    regionId: number;
    useRealCampaigns: boolean;
    recipientEmail: string;
    onRegionIdChange: (id: number) => void;
    onUseRealCampaignsChange: (value: boolean) => void;
    onRecipientEmailChange: (value: string) => void;
    onPreviewHtml: (html: string | null) => void;
    isSending: boolean;
    onSendingChange: (value: boolean) => void;
}

export default function DigestTestForm({
    regionId,
    useRealCampaigns,
    recipientEmail,
    onRegionIdChange,
    onUseRealCampaignsChange,
    onRecipientEmailChange,
    onPreviewHtml,
    isSending,
    onSendingChange,
}: DigestTestFormProps) {
    const { toast } = useToast();
    const [regions, setRegions] = useState<{ id: number; name: string }[]>([]);
    const [previewLoading, setPreviewLoading] = useState(false);
    const initialLoad = useRef(true);

    // Load regions on mount and set default region
    useEffect(() => {
        getRegionsForDigest().then(result => {
            if (result.regions?.length) {
                setRegions(result.regions);
                if (!regionId) onRegionIdChange(result.regions[0].id);
            }
        });
    }, []);

    // Auto-load preview when region or data source changes (and regions are loaded)
    useEffect(() => {
        if (!regionId || regions.length === 0) return;

        let cancelled = false;
        setPreviewLoading(true);
        getDigestPreviewHtml(regionId, useRealCampaigns)
            .then(result => {
                if (cancelled) return;
                if (result.html) onPreviewHtml(result.html);
                else if (result.error && !initialLoad.current) {
                    toast({ title: 'Aperçu', description: result.error, variant: 'destructive' });
                }
            })
            .finally(() => {
                if (!cancelled) setPreviewLoading(false);
                initialLoad.current = false;
            });
        return () => { cancelled = true; };
    }, [regionId, useRealCampaigns, regions.length]);

    const handleRefreshPreview = async () => {
        if (!regionId) return;
        setPreviewLoading(true);
        try {
            const result = await getDigestPreviewHtml(regionId, useRealCampaigns);
            if (result.html) onPreviewHtml(result.html);
            if (result.error) toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
        } finally {
            setPreviewLoading(false);
        }
    };

    const handleSend = async () => {
        if (!recipientEmail?.trim()) {
            toast({ title: 'Email requis', description: 'Entrez l\'adresse du destinataire.', variant: 'destructive' });
            return;
        }
        if (!regionId) {
            toast({ title: 'Région requise', description: 'Choisissez une région.', variant: 'destructive' });
            return;
        }
        onSendingChange(true);
        try {
            const result = await sendTestDigestEmail(recipientEmail.trim(), regionId, useRealCampaigns);
            if (result.success) toast({ title: 'Envoyé', description: result.message });
            else toast({ title: 'Erreur', description: result.error, variant: 'destructive' });
        } finally {
            onSendingChange(false);
        }
    };

    return (
        <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="pr-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Résumé des campagnes</CardTitle>
                        <CardDescription>
                            Envoyer un email de test avec le template réel reçu par les participants (région + campagnes du jour ou exemple).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Région</Label>
                            <Select
                                value={regionId ? String(regionId) : ''}
                                onValueChange={v => onRegionIdChange(Number(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une région" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map(r => (
                                        <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                                type="checkbox"
                                checked={useRealCampaigns}
                                onChange={e => onUseRealCampaignsChange(e.target.checked)}
                                className="h-4 w-4 rounded border-input"
                            />
                            <span>Utiliser les campagnes du jour pour cette région</span>
                        </label>

                        <div className="space-y-2">
                            <Label>Envoyer le test à</Label>
                            <Input
                                type="email"
                                value={recipientEmail}
                                onChange={e => onRecipientEmailChange(e.target.value)}
                                placeholder="email@exemple.com"
                                className="h-9"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRefreshPreview}
                                disabled={previewLoading || !regionId}
                            >
                                {previewLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Rafraîchir l&apos;aperçu
                                    </>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSend}
                                disabled={isSending || !recipientEmail?.trim()}
                            >
                                {isSending ? (
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                    <Send className="w-4 h-4 mr-2" />
                                )}
                                Envoyer l&apos;email de test
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}
