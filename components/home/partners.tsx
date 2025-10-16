import Marquee from 'react-fast-marquee';
import Image from 'next/image';

export default function Partners({ dict }: { dict: any }) {
    const partners = [
        {
            name: 'Ibn Sina',
            logo: '/partners/ibnsina-green.png',
            width: 400,
            height: 250,
            className: 'w-24 h-auto object-contain',
        },
        {
            name: 'Rotaract Tanger Doyen',
            logo: '/partners/rotaract-tanger-doyen.png',
            width: 600,
            height: 200,
            className: 'w-40 h-auto object-contain',
        },
        {
            name: 'dir iddik',
            logo: '/partners/dir-iddik-518x137.png',
            width: 518,
            height: 137,
            className: 'w-40 h-auto object-contain',
        },
        {
            name: 'Rotaract ENSAF',
            logo: '/partners/rotaract-ensaf.png',
            width: 600,
            height: 200,
            className: 'w-40 h-auto object-contain',
        },
        {
            name: 'SPARK EST ESSAOUIRA',
            logo: '/partners/spark.png',
            width: 500,
            height: 500,
            className: 'w-24 h-auto object-contain',
        },
        {
            name: 'Rotaract Ryad Ennakhil',
            logo: '/partners/rotaract-ryad-ennakhil.png',
            width: 600,
            height: 200,
            className: 'w-40 h-auto object-contain',
        },
    ];

    return (
        <section className="py-8 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400 dark:from-brand-400 dark:to-brand-300">
                    {dict.partners}
                </h2>

                <div className="py-8">
                    <Marquee gradient={false} speed={50}>
                        <div className="flex items-center gap-8">
                            {partners.map(partner => (
                                <div
                                    key={partner.name}
                                    className="flex items-center justify-center h-24 overflow-hidden"
                                >
                                    <Image
                                        src={partner.logo}
                                        alt={partner.name}
                                        width={partner.width}
                                        height={partner.height}
                                        className={`${partner.className} mx-4`}
                                    />
                                </div>
                            ))}
                        </div>
                    </Marquee>
                </div>
            </div>
        </section>
    );
}
