'use client';

import { EmailData } from '@/types/email';
import { generatePreviewHTML } from '@/lib/email-composer';
import { useTheme } from 'next-themes';
import type { DigestTestTemplate } from '@/actions/email';

interface EmailPreviewPanelProps {
    templateType: DigestTestTemplate;
    emailData: EmailData;
    digestPreviewHtml?: string | null;
    bloodRequestPreviewHtml?: string | null;
}

export default function EmailPreviewPanel({
    templateType,
    emailData,
    digestPreviewHtml = null,
    bloodRequestPreviewHtml = null,
}: EmailPreviewPanelProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const previewContent =
        templateType === 'digest' && digestPreviewHtml ? (
            <div className="bg-gray-50 dark:bg-black p-3 min-h-96 overflow-auto">
                <div className="mx-auto bg-white dark:bg-background rounded-lg shadow-sm max-w-full">
                    <div className="border-b border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-black rounded-t-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Aperçu – Résumé campagnes
                        </div>
                    </div>
                    <iframe
                        title="Digest preview"
                        srcDoc={digestPreviewHtml}
                        className="w-full min-h-96 border-0 rounded-b-lg"
                        sandbox="allow-same-origin"
                    />
                </div>
            </div>
        ) : templateType === 'digest' ? (
            <div className="bg-gray-50 dark:bg-black p-6 min-h-96 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Sélectionnez une région à gauche pour afficher
                    l&apos;aperçu.
                </p>
            </div>
        ) : templateType === 'blood_request' && bloodRequestPreviewHtml ? (
            <div className="bg-gray-50 dark:bg-black p-3 min-h-96 overflow-auto">
                <div className="mx-auto bg-white dark:bg-background rounded-lg shadow-sm max-w-full">
                    <div className="border-b border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-black rounded-t-lg">
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                            Aperçu – Demande urgente de sang
                        </div>
                    </div>
                    <iframe
                        title="Blood request preview"
                        srcDoc={bloodRequestPreviewHtml}
                        className="w-full min-h-96 border-0 rounded-b-lg"
                        sandbox="allow-same-origin"
                    />
                </div>
            </div>
        ) : templateType === 'blood_request' ? (
            <div className="bg-gray-50 dark:bg-black p-6 min-h-96 flex items-center justify-center">
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                    Choisissez une demande ou l&apos;exemple à gauche pour
                    afficher l&apos;aperçu.
                </p>
            </div>
        ) : (
            <div className="bg-gray-50 dark:bg-black p-3 min-h-96 overflow-auto">
                <div className="mx-auto bg-white dark:bg-background rounded-lg shadow-sm max-w-full">
                    <div className="border-b border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-black rounded-t-lg">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full" />
                                <span>De: notify@tabarro3.ma</span>
                            </div>
                            <div>
                                <span>
                                    À:{' '}
                                    {emailData.recipientEmail ||
                                        'destinataire@exemple.com'}
                                </span>
                            </div>
                        </div>
                        <div className="mt-1.5 text-xs text-gray-800 dark:text-gray-200 font-medium">
                            {emailData.subject}
                        </div>
                    </div>
                    <div
                        className="email-preview"
                        style={{ fontFamily: 'Arial, sans-serif' }}
                        dangerouslySetInnerHTML={{
                            __html: generatePreviewHTML(emailData, isDark),
                        }}
                    />
                </div>
            </div>
        );

    return <div>{previewContent}</div>;
}
