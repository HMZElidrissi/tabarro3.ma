import { z } from 'zod';
import type { User } from '@prisma/client';
import { getUser } from '@/auth/session';
import { redirect } from 'next/navigation';

export type ActionState = {
    error?: string;
    success?: string;
    [key: string]: any;
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (
    data: z.infer<S>,
    formData: FormData,
) => Promise<T>;

type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
    data: z.infer<S>,
    formData: FormData,
    user: User,
) => Promise<T>;

function getSafeFormData(formData: FormData) {
    const raw = Object.fromEntries(formData);
    return {
        email: (raw.email as string) ?? '',
        name: (raw.name as string) ?? '',
        phone: (raw.phone as string) ?? '',
        bloodGroup: (raw.bloodGroup as string) ?? '',
        region: (raw.region as string) ?? '',
        cityId: (raw.cityId as string) ?? '',
    };
}

export function validatedAction<S extends z.ZodType<any, any>, T>(
    schema: S,
    action: ValidatedActionFunction<S, T>,
) {
    return async (prevState: ActionState, formData: FormData): Promise<T> => {
        const result = schema.safeParse(Object.fromEntries(formData));

        if (!result.success) {
            return {
                error: result.error.errors[0].message,
                ...getSafeFormData(formData),
            } as T;
        }

        return action(result.data, formData);
    };
}

export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
    schema: S,
    action: ValidatedActionWithUserFunction<S, T>,
) {
    return async (prevState: ActionState, formData: FormData): Promise<T> => {
        const user = await getUser();
        if (!user) {
            throw new Error('User is not authenticated');
        }

        const result = schema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            return { error: result.error.errors[0].message } as T;
        }

        return action(result.data, formData, user);
    };
}

export function requireAdmin() {
    return async (request: Request) => {
        const user = await getUser();
        if (!user) {
            return redirect('/sign-in');
        }

        if (user.role !== 'ADMIN') {
            return redirect('/dashboard');
        }
    };
}

// Utility function to handle errors in Workers environment
export function handleError(error: unknown): ActionState {
    console.error('Action error:', error);

    if (error instanceof Error) {
        return { error: error.message };
    }

    return { error: 'An unexpected error occurred' };
}
