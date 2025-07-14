'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Monitor, Smartphone, Tablet } from 'lucide-react';
import { EmailData } from '@/types/email';
import { generatePreviewHTML } from '@/lib/email-composer';
import { useTheme } from 'next-themes';

type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

interface EmailPreviewPanelProps {
    emailData: EmailData;
    previewDevice: PreviewDevice;
    setPreviewDeviceAction: (device: PreviewDevice) => void;
}

const getPreviewWidth = (device: PreviewDevice) => {
    switch (device) {
        case 'mobile':
            return 'max-w-sm';
        case 'tablet':
            return 'max-w-md';
        default:
            return 'max-w-2xl';
    }
};

export default function EmailPreviewPanel({
    emailData,
    previewDevice,
    setPreviewDeviceAction,
}: EmailPreviewPanelProps) {
    const { theme } = useTheme();

    const isDark = theme === 'dark';

    return (
        <div className="lg:col-span-3">
            <div className="sticky top-24">
                <Card className="dark:bg-background dark:border-gray-800">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                <div>
                                    <CardTitle className="text-sm dark:text-gray-50">
                                        Aperçu en temps réel
                                    </CardTitle>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-black rounded-lg">
                                    <Button
                                        variant={
                                            previewDevice === 'mobile'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setPreviewDeviceAction('mobile')
                                        }
                                        className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                        <Smartphone className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant={
                                            previewDevice === 'tablet'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setPreviewDeviceAction('tablet')
                                        }
                                        className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                        <Tablet className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        variant={
                                            previewDevice === 'desktop'
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        size="sm"
                                        onClick={() =>
                                            setPreviewDeviceAction('desktop')
                                        }
                                        className="h-7 w-7 p-0 dark:text-gray-400 dark:hover:bg-gray-800 dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
                                        <Monitor className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <div className="bg-gray-50 dark:bg-black p-4 h-[calc(100vh-300px)] overflow-auto">
                                <div
                                    className={`mx-auto bg-white dark:bg-background rounded-lg shadow-sm transition-all duration-300 ${getPreviewWidth(previewDevice)}`}>
                                    {/* Email Client Header */}
                                    <div className="border-b border-gray-200 dark:border-gray-800 p-3 bg-gray-50 dark:bg-black rounded-t-lg">
                                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>
                                                    De: noreply@tabarro3.ma
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>
                                                    À:{' '}
                                                    {emailData.recipientEmail ||
                                                        'destinataire@exemple.com'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-2 text-xs text-gray-800 dark:text-gray-200 font-medium">
                                            {emailData.subject}
                                        </div>
                                    </div>

                                    {/* Email Content */}
                                    <div
                                        className="email-preview"
                                        style={{
                                            fontFamily: 'Arial, sans-serif',
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: generatePreviewHTML(
                                                emailData,
                                                isDark,
                                            ),
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
