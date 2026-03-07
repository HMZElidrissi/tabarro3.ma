'use client';

import { useEffect, useState, useRef } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, RefreshCw, Droplets } from 'lucide-react';
import {
    getBloodRequestsForTest,
    getBloodRequestPreviewHtml,
    sendTestBloodRequestEmail,
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
import { getBloodGroupLabel } from '@/config/blood-group';
import { BloodGroup } from '@/types/enums';

interface BloodRequestTestFormProps {
    requestId: number | null;
    recipientEmail: string;
    onRequestIdChange: (id: number | null) => void;
    onRecipientEmailChange: (value: string) => void;
    onPreviewHtml: (html: string | null) => void;
    isSending: boolean;
    onSendingChange: (value: boolean) => void;
}

export default function BloodRequestTestForm({
    requestId,
    recipientEmail,
    onRequestIdChange,
    onRecipientEmailChange,
    onPreviewHtml,
    isSending,
    onSendingChange,
}: BloodRequestTestFormProps) {
    const { toast } = useToast();
    const [requests, setRequests] = useState<
        { id: number; bloodGroup: BloodGroup; location: string; city: string; phone: string | null; description: string }[]
    >([]);
    const [previewLoading, setPreviewLoading] = useState(false);
    const initialLoad = useRef(true);

    useEffect(() => {
        getBloodRequestsForTest().then(result => {
            if (result.requests?.length) setRequests(result.requests);
        });
    }, []);

    useEffect(() => {
        let cancelled = false;
        setPreviewLoading(true);
        getBloodRequestPreviewHtml(requestId)
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
    }, [requestId]);

    const handleRefreshPreview = async () => {
        setPreviewLoading(true);
        try {
            const result = await getBloodRequestPreviewHtml(requestId);
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
        onSendingChange(true);
        try {
            const result = await sendTestBloodRequestEmail(recipientEmail.trim(), requestId);
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
                        <CardTitle className="text-base flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-red-600" />
                            Demande urgente de sang
                        </CardTitle>
                        <CardDescription>
                            Envoyer un email de test avec le template réel envoyé aux donneurs compatibles (demande réelle ou exemple).
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Demande (ou exemple)</Label>
                            <Select
                                value={requestId === null ? 'sample' : String(requestId)}
                                onValueChange={v =>
                                    onRequestIdChange(v === 'sample' ? null : Number(v))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Choisir une demande" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sample">Exemple (données de démo)</SelectItem>
                                    {requests.map(r => (
                                        <SelectItem key={r.id} value={String(r.id)}>
                                            {getBloodGroupLabel(r.bloodGroup, null, 'request')} – {r.city}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                disabled={previewLoading}
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
