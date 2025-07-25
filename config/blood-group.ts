import { BloodGroup } from '@/types/enums';

export const bloodGroups = [
    { value: BloodGroup.A_POSITIVE, label: 'A+' },
    { value: BloodGroup.A_NEGATIVE, label: 'A-' },
    { value: BloodGroup.B_POSITIVE, label: 'B+' },
    { value: BloodGroup.B_NEGATIVE, label: 'B-' },
    { value: BloodGroup.O_POSITIVE, label: 'O+' },
    { value: BloodGroup.O_NEGATIVE, label: 'O-' },
    { value: BloodGroup.AB_POSITIVE, label: 'AB+' },
    { value: BloodGroup.AB_NEGATIVE, label: 'AB-' },
    { value: BloodGroup.UNKNOWN, label: 'Unknown' },
];

export const bloodGroupsWithDict = (dict?: any) => [
    { value: BloodGroup.A_POSITIVE, label: 'A+' },
    { value: BloodGroup.A_NEGATIVE, label: 'A-' },
    { value: BloodGroup.B_POSITIVE, label: 'B+' },
    { value: BloodGroup.B_NEGATIVE, label: 'B-' },
    { value: BloodGroup.O_POSITIVE, label: 'O+' },
    { value: BloodGroup.O_NEGATIVE, label: 'O-' },
    { value: BloodGroup.AB_POSITIVE, label: 'AB+' },
    { value: BloodGroup.AB_NEGATIVE, label: 'AB-' },
    { value: BloodGroup.UNKNOWN, label: dict.common.unknown },
];

/**
 * Blood donation compatibility mapping
 * Key: recipient blood group
 * Value: array of blood groups that can donate to the recipient
 */
export const BLOOD_COMPATIBILITY: Record<BloodGroup, BloodGroup[]> = {
    [BloodGroup.A_POSITIVE]: [
        BloodGroup.A_POSITIVE,
        BloodGroup.A_NEGATIVE,
        BloodGroup.O_POSITIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.A_NEGATIVE]: [
        BloodGroup.A_NEGATIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.B_POSITIVE]: [
        BloodGroup.B_POSITIVE,
        BloodGroup.B_NEGATIVE,
        BloodGroup.O_POSITIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.B_NEGATIVE]: [
        BloodGroup.B_NEGATIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.AB_POSITIVE]: [
        BloodGroup.A_POSITIVE,
        BloodGroup.A_NEGATIVE,
        BloodGroup.B_POSITIVE,
        BloodGroup.B_NEGATIVE,
        BloodGroup.AB_POSITIVE,
        BloodGroup.AB_NEGATIVE,
        BloodGroup.O_POSITIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.AB_NEGATIVE]: [
        BloodGroup.A_NEGATIVE,
        BloodGroup.B_NEGATIVE,
        BloodGroup.AB_NEGATIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.O_POSITIVE]: [
        BloodGroup.O_POSITIVE,
        BloodGroup.O_NEGATIVE,
        BloodGroup.UNKNOWN,
    ],
    [BloodGroup.O_NEGATIVE]: [BloodGroup.O_NEGATIVE, BloodGroup.UNKNOWN],
    [BloodGroup.UNKNOWN]: [], // No donations for unknown blood group
};

/**
 * Get all blood groups that can donate to a specific recipient blood group
 * @param recipientBloodGroup - The blood group of the person who needs blood
 * @returns Array of blood groups that can safely donate to the recipient
 */
export const getCompatibleDonorBloodGroups = (
    recipientBloodGroup: BloodGroup,
): BloodGroup[] => {
    return BLOOD_COMPATIBILITY[recipientBloodGroup] || [];
};

/**
 * Check if a donor blood group is compatible with a recipient blood group
 * @param donorBloodGroup - The blood group of the potential donor
 * @param recipientBloodGroup - The blood group of the person who needs blood
 * @returns True if the donor can safely donate to the recipient
 */
export const isBloodGroupCompatible = (
    donorBloodGroup: BloodGroup,
    recipientBloodGroup: BloodGroup,
): boolean => {
    const compatibleGroups = getCompatibleDonorBloodGroups(recipientBloodGroup);
    return compatibleGroups.includes(donorBloodGroup);
};

/**
 * Get a summary of blood compatibility for all blood groups
 * Useful for debugging and understanding the notification reach
 */
export const getBloodCompatibilitySummary = () => {
    const summary: Record<
        string,
        { canDonateTo: string[]; canReceiveFrom: string[] }
    > = {};

    Object.values(BloodGroup).forEach(bloodGroup => {
        if (bloodGroup === BloodGroup.UNKNOWN) return;

        const label = getBloodGroupLabel(bloodGroup) || bloodGroup;
        const canReceiveFrom = getCompatibleDonorBloodGroups(bloodGroup).map(
            bg => getBloodGroupLabel(bg) || bg,
        );
        const canDonateTo = Object.values(BloodGroup)
            .filter(
                bg =>
                    bg !== BloodGroup.UNKNOWN &&
                    isBloodGroupCompatible(bloodGroup, bg),
            )
            .map(bg => getBloodGroupLabel(bg) || bg);

        summary[label] = {
            canReceiveFrom,
            canDonateTo,
        };
    });

    return summary;
};

export const getBloodGroupLabel = (
    bloodGroup: BloodGroup | null,
    dict: any = null,
) => {
    if (dict === null) {
        return bloodGroups.find(group => group.value === bloodGroup)?.label;
    }

    return bloodGroupsWithDict(dict).find(group => group.value === bloodGroup)
        ?.label;
};
