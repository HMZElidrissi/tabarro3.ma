import { NextResponse } from 'next/server';
import { discordService } from '@/lib/discord';
import { sendWeeklyStatistics } from '@/jobs/helpers';
import { withAuth } from '@/auth/session';
import { Role } from '@/types/enums';

// GET /api/discord/webhook - Check webhook configuration (Admin only)
export const GET = withAuth(async (request: Request, user: any) => {
    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const shouldTest = searchParams.get('test') === 'true';

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

        if (shouldTest) {
            const testResult = await discordService.testWebhook();
            return NextResponse.json({
                status: testResult ? 'success' : 'failed',
                message: testResult
                    ? 'Discord webhook is configured and working'
                    : 'Discord webhook is configured but test failed',
                webhook_url: 'Set',
                test_result: testResult,
            });
        }

        return NextResponse.json({
            status: 'success',
            message: 'Discord webhook is configured',
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
});

// POST /api/discord/webhook - Send manual notifications (Admin only)
export const POST = withAuth(async (request: Request, user: any) => {
    if (user.role !== Role.ADMIN) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
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

                const customPayload = {
                    content,
                    embeds,
                    username: 'Tabarro3.ma - Custom',
                };

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
});
