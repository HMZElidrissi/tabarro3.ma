import OrganizationsClient from '@/components/organizations/organizations-client';
import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';
import { Role } from '@/types/enums';

interface OrganizationsPageProps {
    searchParams: Promise<{
        page?: string;
        search?: string;
        region?: string;
        cityId?: string;
        role?: string;
    }>;
}

export default async function OrganizationsPage({
    searchParams,
}: OrganizationsPageProps) {
    const user = await getUser();
    if (user?.role !== Role.ADMIN) {
        redirect('/dashboard');
    }

    const params = await searchParams;
    const currentPage = Number(params.page) || 1;
    const currentSearch = params.search || '';
    const currentRegion = params.region || '';
    const currentCityId = params.cityId || '';
    const currentRole = params.role || '';

    return (
        <OrganizationsClient
            currentPage={currentPage}
            currentSearch={currentSearch}
            currentRegion={currentRegion}
            currentCityId={currentCityId}
            currentRole={currentRole}
        />
    );
}
