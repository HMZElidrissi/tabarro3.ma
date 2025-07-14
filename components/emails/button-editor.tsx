import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { MousePointer } from 'lucide-react';

interface ButtonEditorProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
}

export default function ButtonEditor({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
}: ButtonEditorProps) {
    const enabledButtonsCount = [
        emailData.primaryButton.enabled,
        emailData.secondaryButton.enabled,
    ].filter(Boolean).length;

    const badge =
        enabledButtonsCount > 0 ? (
            <Badge variant="secondary" className="text-xs">
                {enabledButtonsCount}
            </Badge>
        ) : null;

    return (
        <CollapsibleCard
            title="Boutons d'action"
            icon={<MousePointer className="w-4 h-4 text-blue-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            badge={badge}
            variant="blue"
        >
            <div className="pt-4 space-y-4">
                {/* Primary Button */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                            Bouton principal
                        </Label>
                        <Switch
                            checked={emailData.primaryButton.enabled}
                            onCheckedChange={checked =>
                                onInputChange('primaryButton.enabled', checked)
                            }
                        />
                    </div>

                    {emailData.primaryButton.enabled && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">
                                        Texte
                                    </Label>
                                    <Input
                                        value={emailData.primaryButton.text}
                                        onChange={e =>
                                            onInputChange(
                                                'primaryButton.text',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Texte du bouton"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">
                                        Style
                                    </Label>
                                    <Select
                                        value={emailData.primaryButton.style}
                                        onValueChange={value =>
                                            onInputChange(
                                                'primaryButton.style',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">
                                                🔴 Principal
                                            </SelectItem>
                                            <SelectItem value="secondary">
                                                ⚫ Secondaire
                                            </SelectItem>
                                            <SelectItem value="outline">
                                                ⭕ Contour
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                    URL
                                </Label>
                                <Input
                                    value={emailData.primaryButton.url}
                                    onChange={e =>
                                        onInputChange(
                                            'primaryButton.url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://..."
                                    className="h-9"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Secondary Button */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">
                            Bouton secondaire
                        </Label>
                        <Switch
                            checked={emailData.secondaryButton.enabled}
                            onCheckedChange={checked =>
                                onInputChange(
                                    'secondaryButton.enabled',
                                    checked,
                                )
                            }
                        />
                    </div>

                    {emailData.secondaryButton.enabled && (
                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">
                                        Texte
                                    </Label>
                                    <Input
                                        value={emailData.secondaryButton.text}
                                        onChange={e =>
                                            onInputChange(
                                                'secondaryButton.text',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Texte du bouton"
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-medium">
                                        Style
                                    </Label>
                                    <Select
                                        value={emailData.secondaryButton.style}
                                        onValueChange={value =>
                                            onInputChange(
                                                'secondaryButton.style',
                                                value,
                                            )
                                        }
                                    >
                                        <SelectTrigger className="h-9">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="primary">
                                                🔴 Principal
                                            </SelectItem>
                                            <SelectItem value="secondary">
                                                ⚫ Secondaire
                                            </SelectItem>
                                            <SelectItem value="outline">
                                                ⭕ Contour
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-medium">
                                    URL
                                </Label>
                                <Input
                                    value={emailData.secondaryButton.url}
                                    onChange={e =>
                                        onInputChange(
                                            'secondaryButton.url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://..."
                                    className="h-9"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CollapsibleCard>
    );
}
