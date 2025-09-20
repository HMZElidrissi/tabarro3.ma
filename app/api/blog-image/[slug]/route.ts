import { getBlogPost } from '@/lib/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },
) {
    try {
        const { slug } = await params;
        const locale = request.nextUrl.searchParams.get('locale') || 'ar';

        const post = await getBlogPost(slug, locale);

        if (!post || !post.coverImage) {
            return new NextResponse('Image not found', { status: 404 });
        }

        const imageResponse = await fetch(post.coverImage);

        if (!imageResponse.ok) {
            return new NextResponse('Failed to fetch image', {
                status: imageResponse.status,
            });
        }

        const imageArrayBuffer = await imageResponse.arrayBuffer();

        let contentType = imageResponse.headers.get('content-type');

        if (!contentType || !contentType.startsWith('image/')) {
            const url = new URL(post.coverImage);
            const path = url.pathname.toLowerCase();

            if (path.endsWith('.png')) contentType = 'image/png';
            else if (path.endsWith('.gif')) contentType = 'image/gif';
            else if (path.endsWith('.webp')) contentType = 'image/webp';
            else if (path.endsWith('.svg')) contentType = 'image/svg+xml';
            else if (path.endsWith('.avif')) contentType = 'image/avif';
            else contentType = 'image/jpeg';
        }

        return new NextResponse(imageArrayBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400',
            },
        });
    } catch (error) {
        console.error('Error serving OG image:', error);
        return new NextResponse('Error processing image', { status: 500 });
    }
}
