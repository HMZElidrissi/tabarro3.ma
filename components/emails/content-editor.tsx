import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EmailData } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { FileText } from 'lucide-react';

interface ContentEditorProps {
    isOpen: boolean;
    onToggle: () => void;
    emailData: EmailData;
    onInputChange: (field: string, value: any) => void;
}

export default function ContentEditor({
    isOpen,
    onToggle,
    emailData,
    onInputChange,
}: ContentEditorProps) {
    return (
        <CollapsibleCard
            title="Contenu principal"
            icon={<FileText className="w-4 h-4 text-green-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            variant="green"
        >
            <div className="pt-4 space-y-4">
                <div className="space-y-2">
                    <Label className="text-xs font-medium">
                        Titre de l'email
                    </Label>
                    <Input
                        value={emailData.title}
                        onChange={e => onInputChange('title', e.target.value)}
                        placeholder="Titre principal"
                        className="h-9"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-medium">Salutation</Label>
                    <Input
                        value={emailData.greeting}
                        onChange={e =>
                            onInputChange('greeting', e.target.value)
                        }
                        placeholder="Cher/Chère..."
                        className="h-9"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-medium">
                        Message principal
                    </Label>
                    <Textarea
                        value={emailData.message}
                        onChange={e => onInputChange('message', e.target.value)}
                        placeholder="Votre message principal..."
                        rows={4}
                        className="resize-none"
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-medium">
                        Contenu supplémentaire
                    </Label>
                    <Textarea
                        value={emailData.additionalContent}
                        onChange={e =>
                            onInputChange('additionalContent', e.target.value)
                        }
                        placeholder="Contenu additionnel..."
                        rows={3}
                        className="resize-none"
                    />
                </div>
            </div>
        </CollapsibleCard>
    );
}
