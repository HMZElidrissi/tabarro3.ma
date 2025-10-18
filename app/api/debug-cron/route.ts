import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');

    return NextResponse.json({
        receivedHeader: authHeader,
        expectedHeader: `Bearer ${process.env.CRON_SECRET}`,
        cronSecretExists: !!process.env.CRON_SECRET,
        cronSecretValue: process.env.CRON_SECRET,
        match: authHeader === `Bearer ${process.env.CRON_SECRET}`,
    });
}
