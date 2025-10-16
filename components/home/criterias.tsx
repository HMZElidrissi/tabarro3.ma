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
        <div className="py-16 bg-background" id="criterias">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                    {dict.criterias.title}
                </h2>
                <div className="flex flex-col md:flex-row items-center md:space-x-12">
                    <div className="flex-1 space-y-6 w-full md:w-1/2">
                        {criterias.map(criteria => (
                            <div
                                key={criteria.name}
                                className="criteria-card bg-muted/50 rounded-lg p-6 border hover:border-brand-200 transition-colors duration-300"
                            >
                                <h3 className="text-lg font-medium text-foreground mb-2">
                                    {criteria.name}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {criteria.description}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="md:flex-1 flex justify-center mt-8 md:mt-0">
                        <Image
                            src="/illustration.svg"
                            alt="Blood donation"
                            width={400}
                            height={400}
                            className="filter drop-shadow-xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
