import { NextRequest, NextResponse } from 'next/server';
import { sendWeeklyStatistics } from '@/jobs/helpers';

// Security check for cron jobs
function isCronAuthorized(request: NextRequest): boolean {
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) return false;

    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');
    return token === cronSecret;
}

// GET /api/cron/discord-stats - Send weekly statistics to Discord
export async function GET(request: NextRequest) {
    try {
        // Verify cron authorization
        if (!isCronAuthorized(request)) {
            console.log(
                'Unauthorized cron request - missing or invalid CRON_SECRET',
            );
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            );
        }

        console.log('Starting weekly Discord statistics job...');

        // Send weekly statistics
        await sendWeeklyStatistics();

        console.log('Weekly Discord statistics sent successfully');

        return NextResponse.json({
            success: true,
            message: 'Weekly statistics sent to Discord successfully',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error sending weekly Discord statistics:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to send weekly statistics',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        );
    }
}

// POST /api/cron/discord-stats - Alternative method for cron jobs
export async function POST(request: NextRequest) {
    // Same implementation as GET for flexibility
    return GET(request);
}
