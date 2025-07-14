import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { Plus, Signature, Trash2 } from 'lucide-react';

interface FooterEditorProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
    onAddFooterLink: () => void;
    onRemoveFooterLink: (index: number) => void;
    onUpdateFooterLink: (
        index: number,
        field: 'text' | 'url',
        value: string,
    ) => void;
}

export default function FooterEditor({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
    onAddFooterLink,
    onRemoveFooterLink,
    onUpdateFooterLink,
}: FooterEditorProps) {
    const enabledSectionsCount = [
        emailData.showSignature,
        emailData.showFooter,
    ].filter(Boolean).length;

    const badge =
        enabledSectionsCount > 0 ? (
            <Badge variant="secondary" className="text-xs">
                {enabledSectionsCount}
            </Badge>
        ) : null;

    return (
        <CollapsibleCard
            title="Signature et pied de page"
            icon={<Signature className="w-4 h-4 text-indigo-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            badge={badge}
            variant="indigo"
        >
            <div className="pt-4 space-y-4">
                {/* Signature */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                            Afficher la signature
                        </Label>
                        <Switch
                            checked={emailData.showSignature}
                            onCheckedChange={checked =>
                                onInputChange('showSignature', checked)
                            }
                        />
                    </div>

                    {emailData.showSignature && (
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">
                                Signature
                            </Label>
                            <Textarea
                                value={emailData.signature}
                                onChange={e =>
                                    onInputChange('signature', e.target.value)
                                }
                                placeholder="Cordialement,..."
                                rows={2}
                                className="resize-none"
                            />
                        </div>
                    )}
                </div>

                <Separator />

                {/* Footer */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                            Afficher le pied de page
                        </Label>
                        <Switch
                            checked={emailData.showFooter}
                            onCheckedChange={checked =>
                                onInputChange('showFooter', checked)
                            }
                        />
                    </div>

                    {emailData.showFooter && (
                        <div className="space-y-3">
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                    Texte du pied de page
                                </Label>
                                <Input
                                    value={emailData.footerText}
                                    onChange={e =>
                                        onInputChange(
                                            'footerText',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Texte additionnel"
                                    className="h-9"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium">
                                    Afficher le copyright
                                </Label>
                                <Switch
                                    checked={emailData.showCopyright}
                                    onCheckedChange={checked =>
                                        onInputChange('showCopyright', checked)
                                    }
                                />
                            </div>

                            {/* Custom Footer Links */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-xs font-medium">
                                        Liens du pied de page
                                    </Label>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={onAddFooterLink}
                                        className="h-7 text-xs"
                                    >
                                        <Plus className="w-3 h-3 mr-1" />
                                        Ajouter
                                    </Button>
                                </div>

                                {emailData.customFooterLinks.map(
                                    (link, index) => (
                                        <div
                                            key={index}
                                            className="flex gap-2 items-end"
                                        >
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs">
                                                    Texte
                                                </Label>
                                                <Input
                                                    value={link.text}
                                                    onChange={e =>
                                                        onUpdateFooterLink(
                                                            index,
                                                            'text',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="Texte du lien"
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <Label className="text-xs">
                                                    URL
                                                </Label>
                                                <Input
                                                    value={link.url}
                                                    onChange={e =>
                                                        onUpdateFooterLink(
                                                            index,
                                                            'url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="https://..."
                                                    className="h-8 text-xs"
                                                />
                                            </div>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                    onRemoveFooterLink(index)
                                                }
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CollapsibleCard>
    );
}
