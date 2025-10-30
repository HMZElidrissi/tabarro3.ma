// import Marquee from 'react-fast-marquee';
import Image from 'next/image';

export default function Partners({ dict }: { dict: any }) {
    const partners = [
        {
            name: 'dir iddik',
            logo: '/partners/dir-iddik-518x137.png',
            width: 518,
            height: 137,
            className: 'w-60 h-auto object-contain',
        },
        {
            name: 'JLM ENCG Agadir',
            logo: '/partners/jlm.png',
            darkLogo: '/partners/jlm_white.png',
            width: 100,
            height: 100,
            className: 'w-32 h-auto object-contain',
        },
        {
            name: 'Rotaract Agadir Atlantique',
            logo: '/partners/rotaract-agadir-atlantique.png',
            width: 600,
            height: 200,
            className: 'w-60 h-auto object-contain',
        },
        {
            name: 'Association Nakhil des donneurs de sang',
            logo: '/partners/ands-kech.png',
            width: 600,
            height: 200,
            className: 'w-60 h-auto object-contain',
        },
    ];

    return (
        <section className="py-4 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                    {dict.partners}
                </h2>

                <div className="py-4">
                    {/* <Marquee gradient={false} speed={50}> */}
                    <div className="flex items-center justify-center gap-4">
                        {partners.map(partner => (
                            <div
                                key={partner.name}
                                className="flex items-center justify-center overflow-hidden">
                                {partner.darkLogo ? (
                                    <>
                                        <Image
                                            src={partner.logo}
                                            alt={partner.name}
                                            width={partner.width}
                                            height={partner.height}
                                            className={`${partner.className} mx-4 dark:hidden`}
                                        />
                                        <Image
                                            src={partner.darkLogo}
                                            alt={partner.name}
                                            width={partner.width}
                                            height={partner.height}
                                            className={`${partner.className} mx-4 hidden dark:block`}
                                        />
                                    </>
                                ) : (
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        width={partner.width}
                                        height={partner.height}
                                        className={`${partner.className} mx-4`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    {/* </Marquee> */}
                </div>
            </div>
        </section>
    );
}
