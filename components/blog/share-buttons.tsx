'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Facebook,
    Instagram,
    Linkedin,
    Whatsapp,
    XTwitter,
} from '@/components/social-icons/icons';
import { Check, Copy } from 'lucide-react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description: string;
    dict: any;
}

export default function ShareButtons({
    url,
    title,
    description,
    dict,
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const xShare = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    const whatsappShare = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
    const instagramShare = `https://www.instagram.com/?url=${encodeURIComponent(url)}`;

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-gray-600 mr-1">
                {dict.blog?.share || 'Share'} :
            </span>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 border-transparent"
                onClick={() => window.open(xShare, '_blank')}
            >
                <XTwitter className="h-5 w-5 text-[#1DA1F2]" />
                <span className="sr-only">Share on X (Twitter)</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#4267B2]/10 hover:bg-[#4267B2]/20 border-transparent"
                onClick={() => window.open(facebookShare, '_blank')}
            >
                <Facebook className="h-5 w-5 text-[#4267B2]" />
                <span className="sr-only">Share on Facebook</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#E1306C]/10 hover:bg-[#E1306C]/20 border-transparent"
                onClick={() => window.open(instagramShare, '_blank')}
            >
                <Instagram className="h-5 w-5 text-[#E1306C]" />
                <span className="sr-only">Share on Instagram</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-transparent"
                onClick={() => window.open(linkedinShare, '_blank')}
            >
                <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                <span className="sr-only">Share on LinkedIn</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-[#25D366]/10 hover:bg-[#25D366]/20 border-transparent"
                onClick={() => window.open(whatsappShare, '_blank')}
            >
                <Whatsapp className="h-5 w-5 text-[#25D366]" />
                <span className="sr-only">Share on WhatsApp</span>
            </Button>

            <Button
                variant="outline"
                size="icon"
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 border-transparent"
                onClick={handleCopy}
            >
                {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                ) : (
                    <Copy className="h-5 w-5" />
                )}
                <span className="sr-only">Copy link</span>
            </Button>
        </div>
    );
}
