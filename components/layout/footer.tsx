import Image from 'next/image';
import SocialIcon from '@/components/social-icons';

interface FooterProps {
    dict: any;
}

export default function Footer({ dict }: FooterProps) {
    return (
        <footer className="relative border-t bg-gradient-to-b from-brand-600 to-brand-700">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12">
                <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                    <div className="flex flex-col items-center gap-4 md:items-start">
                        <Image
                            src="/hero.svg"
                            alt="tabarro3 Logo"
                            width={500}
                            height={500}
                            className="w-auto h-36"
                        />
                    </div>

                    <div className="flex flex-col items-center gap-4 md:items-end">
                        <div className="flex items-center gap-4">
                            <SocialIcon
                                kind="mail"
                                href="mailto:rotaractlesmerinides@gmail.com"
                                size={5}
                                className="text-white hover:text-[#EA4335]"
                            />
                            <SocialIcon
                                kind="instagram"
                                href="https://www.instagram.com/rotaract_les_merinides/"
                                size={5}
                                className="text-white hover:text-[#E1306C]"
                            />
                            <SocialIcon
                                kind="linkedin"
                                href="https://www.linkedin.com/company/rotaract-les-merinides/"
                                size={5}
                                className="text-white hover:text-[#0A66C2]"
                            />
                            <SocialIcon
                                kind="twitter"
                                href="https://x.com/dondesang_maroc"
                                size={5}
                                className="text-white hover:text-[#1DA1F2]"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-brand-200/50">
                    <p className="text-center text-sm text-white">
                        © {new Date().getFullYear()} tabarro3.{' '}
                        {dict.footer.allRightsReserved}
                    </p>
                </div>
            </div>
        </footer>
    );
}
