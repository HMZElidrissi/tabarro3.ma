'use server';

import { prisma } from '@/lib/prisma';
import { Role } from '@/types/enums';
import {
    startOfMonth,
    endOfMonth,
    subMonths,
    startOfYear,
    endOfYear,
    eachMonthOfInterval,
    format,
} from 'date-fns';

export async function getDashboardStats(userId: string, userRole: Role) {
    const now = new Date();
    const startOfThisMonth = startOfMonth(now);
    const endOfThisMonth = endOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const endOfLastMonth = endOfMonth(subMonths(now, 1));

    if (userRole === Role.ADMIN) {
        // Get admin stats
        const [
            totalParticipants,
            lastMonthParticipants,
            totalOrganizations,
            totalCampaigns,
            totalBloodRequests,
        ] = await Promise.all([
            prisma.user.count({
                where: {
                    role: Role.PARTICIPANT,
                    deletedAt: null,
                },
            }),
            prisma.user.count({
                where: {
                    role: Role.PARTICIPANT,
                    createdAt: {
                        gte: startOfLastMonth,
                        lte: endOfLastMonth,
                    },
                    deletedAt: null,
                },
            }),
            prisma.user.count({
                where: {
                    role: Role.ORGANIZATION,
                    deletedAt: null,
                },
            }),
            prisma.campaign.count(),
            prisma.bloodRequest.count({
                where: {
                    status: 'active',
                },
            }),
        ]);

        const thisMonthParticipants = await prisma.user.count({
            where: {
                role: Role.PARTICIPANT,
                createdAt: {
                    gte: startOfThisMonth,
                    lte: endOfThisMonth,
                },
                deletedAt: null,
            },
        });

        // Calculate percentage change
        const previousChange =
            lastMonthParticipants > 0
                ? Math.round(
                      ((thisMonthParticipants - lastMonthParticipants) /
                          lastMonthParticipants) *
                          100,
                  )
                : 0;

        return {
            totalParticipants,
            totalOrganizations,
            totalCampaigns,
            totalBloodRequests,
            previousChange,
        };
    } else {
        // Get organization stats
        const [
            activeCampaigns,
            upcomingCampaigns,
            totalCampaigns,
            totalParticipants,
        ] = await Promise.all([
            prisma.campaign.count({
                where: {
                    organizationId: userId,
                    startTime: { lte: now },
                    endTime: { gte: now },
                },
            }),
            prisma.campaign.count({
                where: {
                    organizationId: userId,
                    startTime: { gt: now },
                },
            }),
            prisma.campaign.count({
                where: {
                    organizationId: userId,
                },
            }),
            prisma.user.count({
                where: {
                    role: Role.PARTICIPANT,
                    deletedAt: null,
                },
            }),
        ]);

        return {
            activeCampaigns,
            upcomingCampaigns,
            totalCampaigns,
            totalParticipants,
        };
    }
}

export async function getRecentParticipants() {
    return prisma.user.findMany({
        where: {
            role: Role.PARTICIPANT,
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            bloodGroup: true,
            createdAt: true,
        },
    });
}

export async function getCampaignsOverview(userId: string, userRole: Role) {
    const now = new Date();
    const startOfCurrentYear = startOfYear(now);
    const endOfCurrentYear = endOfYear(now);
    const startOfPreviousYear = startOfYear(
        new Date(now.getFullYear() - 1, 0, 1),
    );
    const endOfPreviousYear = endOfYear(
        new Date(now.getFullYear() - 1, 11, 31),
    );

    // Get all months for the interval
    const monthsThisYear = eachMonthOfInterval({
        start: startOfCurrentYear,
        end: endOfCurrentYear,
    });

    const monthsPreviousYear = eachMonthOfInterval({
        start: startOfPreviousYear,
        end: endOfPreviousYear,
    });

    // Base query conditions based on user role
    const whereCondition =
        userRole === Role.ORGANIZATION ? { organizationId: userId } : {};

    // Get campaign counts for this year
    const campaignsThisYear = await Promise.all(
        monthsThisYear.map(async month => {
            const startOfMonth = new Date(
                month.getFullYear(),
                month.getMonth(),
                1,
            );
            const endOfMonth = new Date(
                month.getFullYear(),
                month.getMonth() + 1,
                0,
            );

            const count = await prisma.campaign.count({
                where: {
                    ...whereCondition,
                    startTime: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
            return count;
        }),
    );

    // Get campaign counts for previous year
    const campaignsPreviousYear = await Promise.all(
        monthsPreviousYear.map(async (month: Date) => {
            const startOfMonth = new Date(
                month.getFullYear(),
                month.getMonth(),
                1,
            );
            const endOfMonth = new Date(
                month.getFullYear(),
                month.getMonth() + 1,
                0,
            );

            const count = await prisma.campaign.count({
                where: {
                    ...whereCondition,
                    startTime: {
                        gte: startOfMonth,
                        lte: endOfMonth,
                    },
                },
            });
            return count;
        }),
    );

    return {
        labels: monthsThisYear.map(month => format(month, 'MMM')),
        thisYear: campaignsThisYear,
        lastYear: campaignsPreviousYear,
    };
}

export async function getParticipantsPerCity(userId: string, userRole: Role) {
    // Base query conditions based on user role
    const whereCondition =
        userRole === Role.ORGANIZATION ? { organizationId: userId } : {};

    // Get participants grouped by city
    const participantsByCity = await prisma.user.groupBy({
        by: ['cityId'],
        where: {
            role: Role.PARTICIPANT,
            deletedAt: null,
            cityId: {
                not: null,
            },
        },
        _count: {
            id: true,
        },
        orderBy: {
            _count: {
                id: 'desc',
            },
        },
        take: 10, // Limit to top 10 cities
    });

    // Get city names for the grouped data
    const cityIds = participantsByCity.map(item => item.cityId!);
    const cities = await prisma.city.findMany({
        where: {
            id: {
                in: cityIds,
            },
        },
        select: {
            id: true,
            name: true,
        },
    });

    // Create a map for easy lookup
    const cityMap = new Map(cities.map(city => [city.id, city.name]));

    // Format the data
    const labels = participantsByCity.map(
        item => cityMap.get(item.cityId!) || 'Unknown',
    );
    const data = participantsByCity.map(item => item._count.id);

    return {
        labels,
        data,
    };
}

export async function getParticipantsPerRegion(userId: string, userRole: Role) {
    // Get participants with their city and region information
    const participantsByRegion = await prisma.user.findMany({
        where: {
            role: Role.PARTICIPANT,
            deletedAt: null,
            cityId: {
                not: null,
            },
        },
        select: {
            id: true,
            city: {
                select: {
                    region: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    });

    // Group by region and count
    const regionCounts = new Map<string, number>();

    participantsByRegion.forEach(participant => {
        if (participant.city?.region) {
            const regionName = participant.city.region.name;
            regionCounts.set(
                regionName,
                (regionCounts.get(regionName) || 0) + 1,
            );
        }
    });

    // Convert to arrays sorted by count
    const sortedRegions = Array.from(regionCounts.entries()).sort(
        (a, b) => b[1] - a[1],
    );

    return {
        labels: sortedRegions.map(([name]) => name),
        data: sortedRegions.map(([, count]) => count),
    };
}
