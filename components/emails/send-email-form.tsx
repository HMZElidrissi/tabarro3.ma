import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { Loader2, Send } from 'lucide-react';

interface SendEmailFormProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
    onSendEmail: () => void;
    isSending: boolean;
}

export default function SendEmailForm({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
    onSendEmail,
    isSending,
}: SendEmailFormProps) {
    return (
        <CollapsibleCard
            title="Envoyer l'email"
            icon={<Send className="w-4 h-4 text-red-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            variant="red"
        >
            <div className="pt-4 space-y-4">
                <p className="text-xs text-muted-foreground">
                    Sujet, destinataire, puis envoyer.
                </p>
                <div className="space-y-3">
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">
                            Langue de l&apos;email
                        </Label>
                        <Select
                            value={emailData.notificationLanguage ?? 'fr'}
                            onValueChange={value =>
                                onInputChange(
                                    'notificationLanguage',
                                    value ?? 'fr',
                                )
                            }
                        >
                            <SelectTrigger className="h-9">
                                <SelectValue placeholder="Choisir la langue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ar">العربية</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">Sujet</Label>
                        <Input
                            value={emailData.subject}
                            onChange={e =>
                                onInputChange('subject', e.target.value)
                            }
                            placeholder="Sujet de l'email"
                            className="h-9"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-medium">
                            Email du destinataire
                        </Label>
                        <Input
                            type="email"
                            value={emailData.recipientEmail}
                            onChange={e =>
                                onInputChange('recipientEmail', e.target.value)
                            }
                            placeholder="destinataire@exemple.com"
                            className="h-9"
                        />
                    </div>
                </div>

                <Button
                    onClick={onSendEmail}
                    disabled={isSending || !emailData.recipientEmail}
                    className="w-full h-10"
                >
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
            </div>
        </CollapsibleCard>
    );
}
