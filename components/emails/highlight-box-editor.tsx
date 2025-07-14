import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { Square } from 'lucide-react';

interface HighlightBoxEditorProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
}

export default function HighlightBoxEditor({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
}: HighlightBoxEditorProps) {
    const badge = emailData.showHighlight ? (
        <Badge variant="secondary" className="text-xs">
            Actif
        </Badge>
    ) : null;

    return (
        <CollapsibleCard
            title="Encadré d'information"
            icon={<Square className="w-4 h-4 text-orange-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            badge={badge}
            variant="orange"
        >
            <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                        Afficher l'encadré
                    </Label>
                    <Switch
                        checked={emailData.showHighlight}
                        onCheckedChange={checked =>
                            onInputChange('showHighlight', checked)
                        }
                    />
                </div>

                {emailData.showHighlight && (
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                    Icône
                                </Label>
                                <Input
                                    value={emailData.highlightIcon}
                                    onChange={e =>
                                        onInputChange(
                                            'highlightIcon',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="🩸"
                                    className="h-9"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                    Titre
                                </Label>
                                <Input
                                    value={emailData.highlightTitle}
                                    onChange={e =>
                                        onInputChange(
                                            'highlightTitle',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Titre"
                                    className="h-9"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">
                                Contenu
                            </Label>
                            <Textarea
                                value={emailData.highlightContent}
                                onChange={e =>
                                    onInputChange(
                                        'highlightContent',
                                        e.target.value,
                                    )
                                }
                                placeholder="Informations détaillées..."
                                rows={3}
                                className="resize-none"
                            />
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
}
