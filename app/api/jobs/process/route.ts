import { NextRequest, NextResponse } from 'next/server';
import { processPendingJobs } from '@/jobs/processor';

export const maxDuration = 300; // 5 minutes in seconds

/**
 * Process pending jobs
 * This endpoint should be called by a cron job every 30 min, 8am-6pm Morocco time
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            });
        }

        const processedCount = await processPendingJobs();

        return NextResponse.json({
            success: true,
            processedCount,
        });
    } catch (error) {
        console.error('Job processing failed:', error);
        return NextResponse.json(
            { error: 'Failed to process jobs' },
            { status: 500 },
        );
    }
}
