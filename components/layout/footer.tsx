import Image from 'next/image';
import Link from 'next/link';
import SocialIcon from '@/components/social-icons';
import AwardBadge from './award-badge';

interface FooterProps {
    dict: any;
    isRTL?: boolean;
}

export default function Footer({ dict, isRTL = false }: FooterProps) {
    return (
        <footer className="relative border-t bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 dark:bg-card dark:bg-none">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 sm:py-16 relative z-10">
                {/* Main Footer Content Grid - 3 Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 mb-8 sm:mb-12">
                    {/* Column 1: Logo and Social Media */}
                    <div className="flex flex-col items-center md:items-start space-y-6">
                        {/* Logo */}
                        <div className="relative">
                            <Image
                                src="/hero.svg"
                                alt="tabarro3 + Rotaract Les Merinides + Collectif Don de Sang"
                                width={500}
                                height={500}
                                className="w-auto h-24 sm:h-28 lg:h-36 mx-auto md:mx-0 dark:brightness-90"
                            />
                        </div>

                        {/* Follow Us Text */}
                        <p className="text-white/80 dark:text-muted-foreground text-sm text-center md:text-left">
                            {dict.footer?.followUs}
                        </p>

                        {/* Social Media Icons */}
                        <div className="flex items-center justify-center md:justify-start gap-3 sm:gap-4">
                            <div className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                                <SocialIcon
                                    kind="mail"
                                    href="mailto:dondesang.ma@gmail.com"
                                    size={6}
                                    className="text-white dark:text-foreground hover:text-[#EA4335] transition-all duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                                <SocialIcon
                                    kind="facebook"
                                    href="https://www.facebook.com/tabarro3maroc/"
                                    size={6}
                                    className="text-white dark:text-foreground hover:text-[#4267B2] transition-all duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                                <SocialIcon
                                    kind="instagram"
                                    href="https://www.instagram.com/tabarro3_ma/"
                                    size={6}
                                    className="text-white dark:text-foreground hover:text-[#E1306C] transition-all duration-300 hover:scale-110"
                                />
                            </div>
                            <div className="p-2 rounded-full hover:bg-muted/50 transition-colors">
                                <SocialIcon
                                    kind="twitter"
                                    href="https://x.com/tabarro3_ma"
                                    size={6}
                                    className="text-white dark:text-foreground hover:text-[#1DA1F2] transition-all duration-300 hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <div className="flex flex-col items-center">
                        <ul className="w-full space-y-2 sm:space-y-3 text-center text-white/80 dark:text-muted-foreground font-semibold">
                            <li>
                                <Link
                                    href="/about"
                                    className="hover:text-white dark:hover:text-foreground hover:underline transition-colors text-sm sm:text-base block py-1 dark:px-2 dark:rounded dark:hover:bg-muted/30"
                                >
                                    {dict.menu?.about}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/eligibility"
                                    className="hover:text-white dark:hover:text-foreground hover:underline transition-colors text-sm sm:text-base block py-1 dark:px-2 dark:rounded dark:hover:bg-muted/30"
                                >
                                    {dict.menu?.eligibility}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/campaigns"
                                    className="hover:text-white dark:hover:text-foreground hover:underline transition-colors text-sm sm:text-base block py-1 dark:px-2 dark:rounded dark:hover:bg-muted/30"
                                >
                                    {dict.menu?.newCampaigns}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/requests"
                                    className="hover:text-white dark:hover:text-foreground hover:underline transition-colors text-sm sm:text-base block py-1 dark:px-2 dark:rounded dark:hover:bg-muted/30"
                                >
                                    {dict.menu?.bloodRequests}
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/blog"
                                    className="hover:text-white dark:hover:text-foreground hover:underline transition-colors text-sm sm:text-base block py-1 dark:px-2 dark:rounded dark:hover:bg-muted/30"
                                >
                                    {dict.menu?.blog}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Award Badge and Additional Info */}
                    <div className="flex flex-col items-center md:items-end space-y-6">
                        <AwardBadge dict={dict} isRTL={isRTL} />
                    </div>
                </div>

                {/* Bottom Section - Copyright */}
                <div className="pt-6 sm:pt-8 border-t border-white/20 dark:border-border">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                        {/* Copyright */}
                        <p className="order-2 sm:order-1 text-white/70 dark:text-muted-foreground text-xs sm:text-sm">
                            © {new Date().getFullYear()} tabarro3.ma{' | '}
                            {dict.footer.allRightsReserved}
                        </p>

                        {/* Additional Links or Info */}
                        <a
                            href="https://github.com/HMZElidrissi/tabarro3.ma"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-1 sm:order-2 inline-flex items-center gap-1.5 text-white/70 hover:text-white dark:text-muted-foreground dark:hover:text-foreground transition-colors duration-300 text-sm font-medium group dark:px-2 dark:py-1 dark:rounded dark:hover:bg-muted/30"
                        >
                            <svg
                                className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {dict.footer?.proudlyOpenSource}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
