import { Button } from '@/components/ui/button';
import { PRESET_CONTENT } from '@/types/email';
import CollapsibleCard from './collapsible-card';
import { Type } from 'lucide-react';

interface PresetSelectorProps {
    isOpen: boolean;
    onToggle: () => void;
    onApplyPreset: (preset: keyof typeof PRESET_CONTENT) => void;
}

export default function PresetSelector({
    isOpen,
    onToggle,
    onApplyPreset,
}: PresetSelectorProps) {
    return (
        <CollapsibleCard
            title="Modèles rapides"
            icon={<Type className="w-4 h-4 text-blue-600" />}
            isOpen={isOpen}
            onToggle={onToggle}
            variant="blue"
        >
            <div className="grid grid-cols-2 gap-2 pt-4">
                {Object.entries(PRESET_CONTENT).map(([key, preset]) => (
                    <Button
                        key={key}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            onApplyPreset(key as keyof typeof PRESET_CONTENT)
                        }
                        className="h-auto p-3 text-left justify-start"
                    >
                        <div className="flex flex-col items-start">
                            <div className="text-xs font-medium">
                                {key === 'welcome' && '👋 Bienvenue'}
                                {key === 'invitation' && '✉️ Invitation'}
                                {key === 'urgent' && '🚨 Urgent'}
                                {key === 'campaign' && '📅 Campagne'}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                {preset.title}
                            </div>
                        </div>
                    </Button>
                ))}
            </div>
        </CollapsibleCard>
    );
}
