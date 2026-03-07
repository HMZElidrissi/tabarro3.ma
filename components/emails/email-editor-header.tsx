import { Button } from '@/components/ui/button';
import { Copy, Mail } from 'lucide-react';

interface EmailEditorHeaderProps {
    onCopy: () => void;
    showCopyButton?: boolean;
}

export default function EmailEditorHeader({
    onCopy,
    showCopyButton = true,
}: EmailEditorHeaderProps) {
    return (
        <div className="bg-white dark:bg-background border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                                Test des emails
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Prévisualiser et envoyer des emails de test
                                (digest ou personnalisé)
                            </p>
                        </div>
                    </div>
                    {showCopyButton && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onCopy}
                            className="hidden sm:flex dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                            <Copy className="w-4 h-4 mr-2" />
                            Copier HTML
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
