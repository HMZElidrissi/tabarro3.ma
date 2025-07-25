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
        <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200 bg-card">
            <CardContent className="flex-1 p-4">
                <div className="space-y-3">
                    {/* Header with badges */}
                    <div className="flex items-center justify-between">
                        {request.bloodGroup !== BloodGroup.UNKNOWN && (
                            <Badge
                                variant="secondary"
                                className="bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-900/50 dark:text-red-400 dark:hover:bg-red-900/60 font-semibold text-sm px-2 py-1"
                                dir="ltr">
                                {getBloodGroupLabel(request.bloodGroup, dict)}
                            </Badge>
                        )}
                        <Badge
                            variant="outline"
                            className={`${getStatusColor(request.status)} text-xs px-2 py-1`}>
                            {
                                dict.bloodRequests.status[
                                    request.status.toLowerCase()
                                ]
                            }
                        </Badge>
                    </div>

                    {/* Location info in a more compact layout */}
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="font-medium">
                                {request.city.region!.name}
                            </span>
                            <span className="text-muted-foreground/50">•</span>
                            <span>{request.city.name}</span>
                        </div>

                        {request.location && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <InboxIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="truncate">
                                    {request.location}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* User info in compact format */}
                    {request.user && (
                        <div className="bg-muted/50 rounded-lg p-2.5 space-y-1">
                            <div className="flex items-center gap-1.5 text-sm">
                                <User className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium text-foreground">
                                    {request.user.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Mailbox className="h-3 w-3 text-muted-foreground" />
                                <span className="truncate">
                                    {request.user.email}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Description with better typography */}
                    {request.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {request.description}
                        </p>
                    )}
                </div>
            </CardContent>

            {/* Contact button with improved styling */}
            {request.phone && request.status.toLowerCase() === 'active' && (
                <CardFooter className="p-4 pt-0">
                    <Button
                        variant="default"
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800"
                        asChild>
                        <a
                            href={`tel:${request.phone}`}
                            className="flex items-center justify-center gap-2">
                            <Phone className="h-4 w-4" />
                            {dict.common.contact}
                        </a>
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}
