'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Send,
    Zap,
    BarChart3,
    Settings,
    ExternalLink,
    Copy,
    Check,
    CheckCircle2Icon,
    RefreshCw,
    MessageSquare,
    Bell,
    Info,
} from 'lucide-react';

interface DiscordStatus {
    status: 'success' | 'failed' | 'not_configured' | 'error';
    message: string;
    webhook_url: string;
    test_result?: boolean;
}

interface NotificationResponse {
    success: boolean;
    message: string;
    type: string;
    timestamp: string;
}

export function DiscordSettings() {
    const [status, setStatus] = useState<DiscordStatus | null>(null);
    const [loading, setLoading] = useState(false);
    const [testLoading, setTestLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [customLoading, setCustomLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [customTitle, setCustomTitle] = useState('');

    const adminSecret =
        process.env.NEXT_PUBLIC_ADMIN_SECRET || 'your-admin-secret';

    useEffect(() => {
        checkDiscordStatus();
    }, []);

    const checkDiscordStatus = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/discord/webhook', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${adminSecret}`,
                },
            });

            const data = await response.json();
            setStatus(data);
        } catch (error) {
            console.error('Error checking Discord status:', error);
            setStatus({
                status: 'error',
                message: 'Failed to check Discord status',
                webhook_url: 'Unknown',
            });
        } finally {
            setLoading(false);
        }
    };

    const testWebhook = async () => {
        setTestLoading(true);
        try {
            const response = await fetch('/api/discord/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminSecret}`,
                },
                body: JSON.stringify({ type: 'test' }),
            });

            const data: NotificationResponse = await response.json();

            if (data.success) {
                // Refresh status after successful test
                await checkDiscordStatus();
            }

            // Show success/error message
            alert(data.message);
        } catch (error) {
            console.error('Error testing webhook:', error);
            alert('Failed to test webhook');
        } finally {
            setTestLoading(false);
        }
    };

    const sendWeeklyStats = async () => {
        setStatsLoading(true);
        try {
            const response = await fetch('/api/discord/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminSecret}`,
                },
                body: JSON.stringify({ type: 'weekly_stats' }),
            });

            const data: NotificationResponse = await response.json();
            alert(data.message);
        } catch (error) {
            console.error('Error sending weekly stats:', error);
            alert('Failed to send weekly statistics');
        } finally {
            setStatsLoading(false);
        }
    };

    const sendCustomNotification = async () => {
        if (!customTitle.trim() || !customMessage.trim()) {
            alert('Please enter both title and message');
            return;
        }

        setCustomLoading(true);
        try {
            const response = await fetch('/api/discord/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${adminSecret}`,
                },
                body: JSON.stringify({
                    type: 'system',
                    data: {
                        title: customTitle,
                        message: customMessage,
                        notificationType: 'info',
                    },
                }),
            });

            const data: NotificationResponse = await response.json();
            alert(data.message);

            if (data.success) {
                setCustomTitle('');
                setCustomMessage('');
            }
        } catch (error) {
            console.error('Error sending custom notification:', error);
            alert('Failed to send custom notification');
        } finally {
            setCustomLoading(false);
        }
    };

    const copyWebhookUrl = async () => {
        try {
            await navigator.clipboard.writeText(
                process.env.NEXT_PUBLIC_BASE_URL + '/api/discord/webhook',
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const getStatusIcon = () => {
        switch (status?.status) {
            case 'success':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'failed':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'not_configured':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusBadge = () => {
        switch (status?.status) {
            case 'success':
                return (
                    <Badge variant="default" className="bg-green-500">
                        Configured
                    </Badge>
                );
            case 'failed':
                return <Badge variant="destructive">Not Configured</Badge>;
            case 'not_configured':
                return <Badge variant="secondary">Not Configured</Badge>;
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Discord Webhook Configuration
                    </CardTitle>
                    <CardDescription>
                        Manage Discord notifications for your blood donation
                        platform
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {status && (
                        <Alert
                            variant={
                                status.status === 'success'
                                    ? 'default'
                                    : 'destructive'
                            }>
                            <CheckCircle2Icon className="h-4 w-4" />
                            <AlertTitle>
                                {status.status === 'success'
                                    ? 'Webhook Configured'
                                    : 'Configuration Issue'}
                            </AlertTitle>
                            <AlertDescription>
                                {status.message}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex gap-2">
                        <Button
                            onClick={checkDiscordStatus}
                            disabled={loading}
                            variant="outline"
                            size="sm">
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                            />
                            {loading ? 'Checking...' : 'Refresh Status'}
                        </Button>

                        <Button
                            onClick={testWebhook}
                            disabled={
                                testLoading ||
                                status?.status === 'not_configured'
                            }
                            variant="default"
                            size="sm">
                            <Zap className="h-4 w-4 mr-2" />
                            {testLoading ? 'Testing...' : 'Test Webhook'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* API Endpoint Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        API Endpoint
                    </CardTitle>
                    <CardDescription>
                        Use this endpoint to send Discord notifications
                        programmatically
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <code className="flex-1 bg-muted px-3 py-2 rounded text-sm">
                            {process.env.NEXT_PUBLIC_BASE_URL}
                            /api/discord/webhook
                        </code>
                        <Button
                            onClick={copyWebhookUrl}
                            variant="outline"
                            size="sm">
                            {copied ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        <p>
                            <strong>Authentication:</strong> Bearer token
                            required
                        </p>
                        <p>
                            <strong>Methods:</strong> GET (test), POST (send
                            notifications)
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Quick Actions
                    </CardTitle>
                    <CardDescription>
                        Send notifications and test different features
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button
                            onClick={sendWeeklyStats}
                            disabled={
                                statsLoading ||
                                status?.status === 'not_configured'
                            }
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2">
                            <BarChart3 className="h-6 w-6" />
                            <div className="text-center">
                                <div className="font-medium">
                                    Weekly Statistics
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {statsLoading
                                        ? 'Sending...'
                                        : 'Send weekly stats to Discord'}
                                </div>
                            </div>
                        </Button>

                        <Button
                            onClick={testWebhook}
                            disabled={
                                testLoading ||
                                status?.status === 'not_configured'
                            }
                            variant="outline"
                            className="h-auto p-4 flex flex-col items-center gap-2">
                            <MessageSquare className="h-6 w-6" />
                            <div className="text-center">
                                <div className="font-medium">
                                    Test Notification
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {testLoading
                                        ? 'Testing...'
                                        : 'Send test message'}
                                </div>
                            </div>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Custom Notification Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Custom Notification
                    </CardTitle>
                    <CardDescription>
                        Send a custom system notification to Discord
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium">Title</label>
                            <input
                                type="text"
                                value={customTitle}
                                onChange={e => setCustomTitle(e.target.value)}
                                placeholder="Enter notification title"
                                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                                disabled={status?.status === 'not_configured'}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Message
                            </label>
                            <textarea
                                value={customMessage}
                                onChange={e => setCustomMessage(e.target.value)}
                                placeholder="Enter notification message"
                                rows={3}
                                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background resize-none"
                                disabled={status?.status === 'not_configured'}
                            />
                        </div>
                    </div>

                    <Button
                        onClick={sendCustomNotification}
                        disabled={
                            customLoading || status?.status === 'not_configured'
                        }
                        className="w-full">
                        <Bell className="h-4 w-4 mr-2" />
                        {customLoading
                            ? 'Sending...'
                            : 'Send Custom Notification'}
                    </Button>
                </CardContent>
            </Card>

            {/* Usage Instructions Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Usage Instructions
                    </CardTitle>
                    <CardDescription>
                        How to configure and use Discord notifications
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3 text-sm">
                        <div>
                            <h4 className="font-medium">
                                1. Configure Discord Webhook
                            </h4>
                            <p className="text-muted-foreground">
                                Set the <code>DISCORD_WEBHOOK_URL</code>{' '}
                                environment variable with your Discord webhook
                                URL.
                            </p>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium">
                                2. Automatic Notifications
                            </h4>
                            <p className="text-muted-foreground">
                                The system automatically sends notifications
                                for:
                            </p>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
                                <li>New participants registrations</li>
                                <li>Urgent blood requests</li>
                                <li>New campaign announcements</li>
                                <li>Weekly statistics (via cron job)</li>
                            </ul>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-medium">
                                3. Manual Notifications
                            </h4>
                            <p className="text-muted-foreground">
                                Use the API endpoint or this dashboard to send
                                custom notifications.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
