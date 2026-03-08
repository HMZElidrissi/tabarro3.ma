import Image from 'next/image';

export default function CriteriasComponent({ dict }: { dict: any }) {
    const criterias = [
        {
            name: dict.criterias.ageAndWeight.title,
            description: dict.criterias.ageAndWeight.description,
        },
        {
            name: dict.criterias.generalHealth.title,
            description: dict.criterias.generalHealth.description,
        },
        {
            name: dict.criterias.donationFrequency.title,
            description: dict.criterias.donationFrequency.description,
        },
    ];

    return (
        <div className="section-band py-16 md:py-20" id="criterias">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="font-display text-3xl font-bold text-center text-foreground sm:text-4xl mb-10 tracking-tight">
                    {dict.criterias.title}
                </h2>
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
                    <div className="flex-1 space-y-6 w-full md:max-w-xl">
                        {criterias.map(criteria => (
                            <div
                                key={criteria.name}
                                className="bg-card rounded-2xl p-6 border border-border/60 shadow-sm card-lift"
                            >
                                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                                    {criteria.name}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {criteria.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="md:flex-1 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-brand-200/30 to-brand-400/20 dark:from-brand-900/30 dark:to-brand-700/20 rounded-3xl blur-2xl -z-10" />
                            <Image
                                src="/illustration.svg"
                                alt="Blood donation"
                                width={400}
                                height={400}
                                className="filter drop-shadow-xl max-w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
