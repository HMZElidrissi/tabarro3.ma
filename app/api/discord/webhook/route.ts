import { NextRequest, NextResponse } from 'next/server';
import { discordService } from '@/lib/discord';
import { sendWeeklyStatistics } from '@/jobs/helpers';

// Admin-only access check
function isAdminAuthorized(request: NextRequest): boolean {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) return false;

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    return token === adminSecret;
}

// GET /api/discord/webhook - Test webhook configuration
export async function GET(request: NextRequest) {
    try {
        if (!isAdminAuthorized(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const isConfigured = discordService.isConfigured();

        if (!isConfigured) {
            return NextResponse.json({
                status: 'not_configured',
                message: 'Discord webhook URL is not configured',
                webhook_url: process.env.DISCORD_WEBHOOK_URL
                    ? 'Set'
                    : 'Not set',
            });
        }

        // Just check if webhook URL is valid, don't actually test it
        const isValidUrl = discordService.isConfigured();

        return NextResponse.json({
            status: isValidUrl ? 'success' : 'failed',
            message: isValidUrl
                ? 'Discord webhook is configured'
                : 'Discord webhook URL is invalid',
            webhook_url: 'Set',
        });
    } catch (error) {
        console.error('Error testing Discord webhook:', error);
        return NextResponse.json(
            {
                status: 'error',
                error: 'Internal server error',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}

// POST /api/discord/webhook - Send manual notifications
export async function POST(request: NextRequest) {
    try {
        if (!isAdminAuthorized(request)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { type, data } = body;

        if (!type) {
            return NextResponse.json(
                { error: 'Missing notification type' },
                { status: 400 },
            );
        }

        let result = false;
        let message = '';

        switch (type) {
            case 'test':
                result = await discordService.testWebhook();
                message = result
                    ? 'Test notification sent successfully'
                    : 'Test notification failed';
                break;

            case 'system':
                const {
                    title,
                    message: systemMessage,
                    notificationType = 'info',
                } = data || {};
                if (!title || !systemMessage) {
                    return NextResponse.json(
                        {
                            error: 'Missing title or message for system notification',
                        },
                        { status: 400 },
                    );
                }
                result = await discordService.sendSystemNotification(
                    title,
                    systemMessage,
                    notificationType,
                );
                message = result
                    ? 'System notification sent successfully'
                    : 'System notification failed';
                break;

            case 'weekly_stats':
                await sendWeeklyStatistics();
                result = true;
                message = 'Weekly statistics sent successfully';
                break;

            case 'custom':
                const { content, embeds } = data || {};
                if (!content && !embeds) {
                    return NextResponse.json(
                        {
                            error: 'Missing content or embeds for custom notification',
                        },
                        { status: 400 },
                    );
                }

                // Send custom webhook payload
                const customPayload = {
                    content,
                    embeds,
                    username: 'Tabarro3.ma - Custom',
                };

                // Use the internal webhook method
                result = await (discordService as any).sendWebhook(
                    customPayload,
                );
                message = result
                    ? 'Custom notification sent successfully'
                    : 'Custom notification failed';
                break;

            default:
                return NextResponse.json(
                    { error: `Unknown notification type: ${type}` },
                    { status: 400 },
                );
        }

        return NextResponse.json({
            success: result,
            message,
            type,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error sending Discord notification:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Internal server error',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}
