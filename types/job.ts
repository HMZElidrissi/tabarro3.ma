export enum JobType {
    BLOOD_REQUEST_NOTIFICATION = 'BLOOD_REQUEST_NOTIFICATION',
    CAMPAIGN_DIGEST = 'CAMPAIGN_DIGEST',
}

export enum JobStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
}

export interface Job {
    id: string;
    type: JobType;
    payload: any;
    status: JobStatus;
    attempts: number;
    maxAttempts: number;
    error?: string;
    createdAt: Date;
    updatedAt: Date;
    processedAt?: Date;
}
