import { ScrollArea } from '@/components/ui/scroll-area';
import PresetSelector from './preset-selector';
import LogoOptions from './logo-options';
import ContentEditor from './content-editor';
import HighlightBoxEditor from './highlight-box-editor';
import ButtonEditor from './button-editor';
import FooterEditor from './footer-editor';
import SendEmailForm from './send-email-form';
import { EmailData, PRESET_CONTENT } from '@/types/email';

type Section =
    | 'presets'
    | 'logo'
    | 'content'
    | 'highlight'
    | 'buttons'
    | 'signature'
    | 'send';

interface EmailEditorPanelProps {
    emailData: EmailData;
    openSections: Record<Section, boolean>;
    isSending: boolean;
    onInputChange: (field: string, value: any) => void;
    onApplyPreset: (preset: keyof typeof PRESET_CONTENT) => void;
    onToggleSection: (section: Section) => void;
    onAddFooterLink: () => void;
    onRemoveFooterLink: (index: number) => void;
    onUpdateFooterLink: (
        index: number,
        field: 'text' | 'url',
        value: string,
    ) => void;
    onSendEmail: () => void;
}

export default function EmailEditorPanel({
    emailData,
    openSections,
    isSending,
    onInputChange,
    onApplyPreset,
    onToggleSection,
    onAddFooterLink,
    onRemoveFooterLink,
    onUpdateFooterLink,
    onSendEmail,
}: EmailEditorPanelProps) {
    return (
        <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pr-4">
                    <PresetSelector
                        isOpen={openSections.presets}
                        onToggle={() => onToggleSection('presets')}
                        onApplyPreset={onApplyPreset}
                    />
                    <LogoOptions
                        isOpen={openSections.logo}
                        onToggle={() => onToggleSection('logo')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                    />
                    <ContentEditor
                        isOpen={openSections.content}
                        onToggle={() => onToggleSection('content')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                    />
                    <HighlightBoxEditor
                        isOpen={openSections.highlight}
                        onToggle={() => onToggleSection('highlight')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                    />
                    <ButtonEditor
                        isOpen={openSections.buttons}
                        onToggle={() => onToggleSection('buttons')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                    />
                    <FooterEditor
                        isOpen={openSections.signature}
                        onToggle={() => onToggleSection('signature')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                        onAddFooterLink={onAddFooterLink}
                        onRemoveFooterLink={onRemoveFooterLink}
                        onUpdateFooterLink={onUpdateFooterLink}
                    />
                    <SendEmailForm
                        isOpen={openSections.send}
                        onToggle={() => onToggleSection('send')}
                        emailData={emailData}
                        onInputChange={onInputChange}
                        onSendEmail={onSendEmail}
                        isSending={isSending}
                    />
                </div>
            </ScrollArea>
        </div>
    );
}
