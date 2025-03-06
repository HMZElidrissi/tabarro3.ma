import {
    Mail,
    Github,
    Facebook,
    Youtube,
    Linkedin,
    XTwitter,
    Mastodon,
    Threads,
    Instagram,
    Bsky,
    Pinterest,
    Reddit,
    Spotify,
    Whatsapp,
} from './icons';

const components = {
    mail: Mail,
    github: Github,
    facebook: Facebook,
    youtube: Youtube,
    linkedin: Linkedin,
    twitter: XTwitter,
    mastodon: Mastodon,
    threads: Threads,
    instagram: Instagram,
    bsky: Bsky,
    reddit: Reddit,
    pinterest: Pinterest,
    spotify: Spotify,
    whatsapp: Whatsapp,
};

type SocialIconProps = {
    kind: keyof typeof components;
    href: string | undefined;
    size?: number;
    className?: string;
};

const SocialIcon = ({ kind, href, size = 8, className }: SocialIconProps) => {
    if (
        !href ||
        (kind === 'mail' &&
            !/^mailto:\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(href))
    )
        return null;

    const SocialSvg = components[kind];

    return (
        <a
            className="text-sm text-brand-600 transition hover:text-brand-700"
            target="_blank"
            rel="noopener noreferrer"
            href={href}>
            <span className="sr-only">{kind}</span>
            <SocialSvg
                className={`transition-colors duration-300 ${className} h-${size} w-${size}`}
                fill="white"
            />
        </a>
    );
};

export default SocialIcon;
