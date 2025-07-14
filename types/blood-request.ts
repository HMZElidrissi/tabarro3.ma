import { BloodGroup } from '@/types/enums';
import { City } from '@/types/city';
import { User } from '@/types/user';

export interface BloodRequest {
    id: number;
    description: string;
    bloodGroup: BloodGroup;
    city: City;
    cityId: number;
    location: string;
    phone: string;
    status: string;
    userId: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: User | null;
}
