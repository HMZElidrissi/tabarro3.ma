import { BloodRequestCard } from '@/components/blood-requests/blood-request-card';
import { BloodRequest } from '@/types/blood-request';

interface BloodRequestsListProps {
    requests: BloodRequest[];
    dict: any;
}

export default function BloodRequestsList({
    requests,
    dict,
}: BloodRequestsListProps) {
    return (
        <div className="container mx-auto py-8">
            <div className="space-y-6">
                <div className="text-center mb-16 relative">
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 opacity-10">
                        <svg
                            width="120"
                            height="120"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-brand-600"
                        >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-400">
                        {dict.Blood_Requests}
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        {dict.Blood_Requests_Description}
                    </p>

                    <div className="mt-8 w-24 h-1 bg-brand-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map(request => (
                        <BloodRequestCard
                            key={request.id}
                            request={request}
                            dict={dict}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
