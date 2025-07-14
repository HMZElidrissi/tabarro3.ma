'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Role } from '@/types/enums';
import { useToast } from '@/hooks/use-toast';
import {
    exportBloodRequests,
    exportCampaigns,
    exportParticipants,
} from '@/actions/export';

interface DashboardExportProps {
    userRole: Role;
}

export function DashboardExport({ userRole }: DashboardExportProps) {
    const { toast } = useToast();
    const [isExporting, setIsExporting] = useState(false);

    const downloadPDF = (buffer: ArrayBuffer, fileName: string) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleExport = async (
        type: 'campaigns' | 'participants' | 'blood-requests',
    ) => {
        setIsExporting(true);
        try {
            const fileName = `${type}-report-${new Date().toISOString().split('T')[0]}.pdf`;
            let result;

            switch (type) {
                case 'campaigns':
                    result = await exportCampaigns({}, new FormData());
                    break;
                case 'participants':
                    result = await exportParticipants({}, new FormData());
                    break;
                case 'blood-requests':
                    result = await exportBloodRequests({}, new FormData());
                    break;
            }

            if (result.error) {
                toast({
                    title: 'Export Failed',
                    description: result.error,
                    variant: 'destructive',
                });
                return;
            }

            if (result.success && result.data) {
                downloadPDF(result.data, fileName);
                toast({
                    title: 'Export Successful',
                    description: `${type} report has been downloaded.`,
                });
            }
        } catch (error) {
            toast({
                title: 'Export Failed',
                description:
                    'An unexpected error occurred while generating the report.',
                variant: 'destructive',
            });
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="default" disabled={isExporting}>
                    {isExporting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="mr-2 h-4 w-4" />
                    )}
                    Export Report
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>Download Reports</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    disabled={isExporting}
                    onClick={() => handleExport('campaigns')}
                >
                    Campaigns Report
                </DropdownMenuItem>
                {userRole === Role.ADMIN && (
                    <>
                        <DropdownMenuItem
                            disabled={isExporting}
                            onClick={() => handleExport('participants')}
                        >
                            Participants Report
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            disabled={isExporting}
                            onClick={() => handleExport('blood-requests')}
                        >
                            Blood Requests Report
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
