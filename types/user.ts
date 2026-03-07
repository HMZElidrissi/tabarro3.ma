import { BloodGroup, Role } from '@/types/enums';
import { City } from '@/types/city';
import { Invitation } from '@/types/invitation';
import { Campaign, CampaignParticipant } from '@/types/campaign';
import { BloodRequest } from '@/types/blood-request';

export interface User {
    id: string;
    name: string | null;
    email: string;
    role: Role;
    phone: string | null;
    bloodGroup: BloodGroup | null;
    city?: City | null;
    cityId: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    receiveCampaignDigests: boolean;
    receiveBloodRequestEmails: boolean;
    invitationsSent?: Invitation[];
    campaigns?: Campaign[];
    participatedCampaigns?: CampaignParticipant[];
    bloodRequests?: BloodRequest[];
}
