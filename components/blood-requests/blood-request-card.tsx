'use client';

import { Mailbox, MapPin, Navigation, Phone, User } from 'lucide-react';
import { InboxIcon } from '@heroicons/react/24/outline';
import { BloodRequest } from '@/types/blood-request';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getBloodGroupLabel } from '@/config/blood-group';
import { getStatusColor } from '@/lib/utils';
import { BloodGroup } from '@/types/enums';

interface BloodRequestCardProps {
    request: BloodRequest;
    dict: any;
}

export function BloodRequestCard({ request, dict }: BloodRequestCardProps) {
    return (
        <Card className="h-full flex flex-col shadow-md hover:shadow-lg">
            <CardContent className="flex-1 pt-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        {request.bloodGroup !== BloodGroup.UNKNOWN && (
                            <Badge
                                variant="secondary"
                                className="bg-brand-100 text-brand-800 hover:bg-brand-200 font-semibold"
                                dir="ltr"
                            >
                                {getBloodGroupLabel(request.bloodGroup, dict)}
                            </Badge>
                        )}
                        <Badge
                            variant="outline"
                            className={`${getStatusColor(request.status)}`}
                        >
                            {
                                dict.bloodRequests.status[
                                    request.status.toLowerCase()
                                ]
                            }
                        </Badge>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <MapPin className="h-4 w-4" />
                            {request.city.region!.name}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-800">
                            <Navigation className="h-4 w-4" />
                            {request.city.name}
                        </div>

                        {request.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-800">
                                <InboxIcon className="h-4 w-4" />
                                {request.location}
                            </div>
                        )}

                        {request.user && (
                            <>
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                    <User className="h-4 w-4" />
                                    {request.user.name}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-800">
                                    <Mailbox className="h-4 w-4" />
                                    {request.user.email}
                                </div>
                            </>
                        )}

                        {request.description && (
                            <p className="text-sm mt-2 text-gray-900">
                                {request.description}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>

            {request.phone && request.status.toLowerCase() === 'active' && (
                <CardFooter className="pt-6">
                    <Button variant="secondary" className="w-full" asChild>
                        <a
                            href={`tel:${request.phone}`}
                            className="flex items-center gap-2"
                        >
                            <Phone className="h-4 w-4" />
                            {dict.common.contact}
                        </a>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
