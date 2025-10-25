import { NextRequest, NextResponse } from 'next/server';
import { processCampaignDigests } from '@/jobs/digest-helpers';

/**
 * Process daily campaign digests
 * This endpoint should be called by a cron job at 6-7 PM daily
 */
export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');

        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new Response('Unauthorized', {
                status: 401,
            });
        }

        console.log('Starting daily campaign digest processing...');

        const processedCount = await processCampaignDigests();

        return NextResponse.json({
            success: true,
            message: `Processed ${processedCount} campaign digests`,
            processedCount,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Campaign digest processing failed:', error);
        return NextResponse.json(
            {
                error: 'Failed to process campaign digests',
                message:
                    error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 },
        );
    }
}

export const config = {
    maxDuration: 300, // 5 minutes
};
