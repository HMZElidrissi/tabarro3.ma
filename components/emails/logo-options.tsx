import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { Image } from 'lucide-react';

interface LogoOptionsProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
}

export default function LogoOptions({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
}: LogoOptionsProps) {
    return (
        <CollapsibleCard
            title="Logo et branding"
            icon={<Image className="w-4 h-4 text-purple-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            variant="purple"
        >
            <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">
                        Afficher le logo
                    </Label>
                    <Switch
                        checked={emailData.showLogo}
                        onCheckedChange={checked =>
                            onInputChange('showLogo', checked)
                        }
                    />
                </div>

                {emailData.showLogo && (
                    <div className="space-y-3">
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">
                                URL du logo
                            </Label>
                            <Input
                                value={emailData.logoUrl}
                                onChange={e =>
                                    onInputChange('logoUrl', e.target.value)
                                }
                                placeholder="https://example.com/logo.png"
                                className="h-9"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-medium">
                                Largeur (px)
                            </Label>
                            <Input
                                type="number"
                                value={emailData.logoWidth}
                                onChange={e =>
                                    onInputChange(
                                        'logoWidth',
                                        parseInt(e.target.value),
                                    )
                                }
                                min="50"
                                max="300"
                                className="h-9"
                            />
                        </div>
                    </div>
                )}
            </div>
        </CollapsibleCard>
    );
}
