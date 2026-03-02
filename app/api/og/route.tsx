import { ImageResponse } from '@takumi-rs/image-response';
import type { NextRequest } from 'next/server';

function LogoComponent() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                background:
                    'linear-gradient(135deg, rgba(245,71,72,0.1) 0%, rgba(245,71,72,0) 100%)',
                border: '1px solid rgba(245,71,72,0.2)',
                boxShadow: '0 0 20px rgba(245,71,72,0.1)',
            }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="124"
                height="124"
                viewBox="52.88 100.9 269.25 146.4"
                fill="#f54748">
                <path d="M 194.398438 175.253906 C 191.507812 177.652344 186.371094 178.140625 183.335938 175.675781 C 182.453125 174.964844 181.867188 174.066406 181.148438 173.210938 C 180.957031 172.96875 180.753906 172.734375 180.539062 172.515625 C 180.445312 172.542969 180.269531 172.550781 180.007812 172.542969 C 178.089844 173.320312 176.925781 174.796875 174.695312 174.980469 C 170.621094 175.320312 166.566406 174.984375 162.695312 173.890625 C 161.160156 177.679688 160.207031 181.117188 160.207031 183.8125 C 160.207031 197.617188 171.398438 208.8125 185.207031 208.8125 C 199.011719 208.8125 210.203125 197.617188 210.203125 183.8125 C 210.203125 181.492188 209.492188 178.613281 208.316406 175.4375 C 203.652344 174.46875 198.546875 171.808594 194.398438 175.253906" />
                <path d="M 185.207031 213.894531 C 168.210938 213.894531 154.433594 200.117188 154.433594 183.121094 C 154.433594 174.660156 162.058594 160.234375 169.714844 147.875 C 177.441406 135.40625 185.207031 125.035156 185.207031 125.035156 C 185.207031 125.035156 215.980469 166.125 215.980469 183.121094 C 215.980469 200.117188 202.203125 213.894531 185.207031 213.894531 Z M 185.207031 117.917969 C 185.207031 117.917969 176.199219 129.945312 167.230469 144.417969 C 158.347656 158.757812 149.5 175.492188 149.5 185.308594 C 149.5 205.027344 165.488281 221.011719 185.207031 221.011719 C 204.925781 221.011719 220.910156 205.027344 220.910156 185.308594 C 220.910156 165.585938 185.207031 117.917969 185.207031 117.917969" />
            </svg>
        </div>
    );
}

function OgImage({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                backgroundColor: '#0a0a0a',
                backgroundImage: `
                    radial-gradient(circle at 10% 10%, rgba(245, 71, 72, 0.15) 0%, transparent 40%),
                    radial-gradient(circle at 90% 90%, rgba(255, 255, 255, 0.05) 0%, transparent 40%),
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 64px 64px, 64px 64px',
                backgroundPosition: '0 0, 0 0, 0 0, 0 0',
                fontFamily: 'Geist',
                padding: '80px',
            }}>
            {/* Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: 'auto',
                }}>
                <LogoComponent />
                <span
                    style={{
                        fontSize: '32px',
                        fontWeight: 600,
                        color: '#ededed',
                        letterSpacing: '-0.01em',
                    }}>
                    tabarro3.ma
                </span>
            </div>

            {/* Content */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    marginTop: '60px',
                }}>
                {/* Title */}
                <h1
                    style={{
                        fontSize: title.length > 40 ? '64px' : '88px',
                        fontWeight: 700,
                        color: '#ffffff',
                        letterSpacing: '-0.04em',
                        lineHeight: 1.05,
                        margin: 0,
                        textShadow: '0 2px 24px rgba(255,255,255,0.2)',
                        maxWidth: '900px',
                    }}>
                    {title}
                </h1>

                {/* Description */}
                <p
                    style={{
                        fontSize: '36px',
                        color: '#a1a1aa', // zinc-400
                        lineHeight: 1.4,
                        fontWeight: 400,
                        letterSpacing: '-0.01em',
                        maxWidth: '850px',
                        margin: 0,
                    }}>
                    {description}
                </p>
            </div>

            {/* Footer / Meta */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: 'auto',
                    gap: '16px',
                }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '100px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                    <span
                        style={{
                            color: '#fff',
                            fontSize: '20px',
                            fontWeight: 500,
                        }}>
                        tabarro3.ma
                    </span>
                </div>
            </div>
        </div>
    );
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);

        const title = searchParams.get('title') || 'Tabarro3';
        const description =
            searchParams.get('description') || 'Plateforme de don de sang';

        return new ImageResponse(
            <OgImage title={title} description={description} />,
            {
                width: 1200,
                height: 630,
            },
        );
    } catch (error) {
        console.error('Error generating OG image:', error);
        return new Response(null, {
            status: 302,
            headers: {
                Location: '/og-image.png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    }
}
