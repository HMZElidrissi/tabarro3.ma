import { Metadata } from 'next';
import { UnsubscribeForm } from '@/components/unsubscribe/unsubscribe-form';
import { getDictionary } from '@/i18n/get-dictionary';

interface UnsubscribePageProps {
    searchParams: Promise<{ token?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const dict = await getDictionary();
    return {
        title: `${dict.unsubscribe?.title ?? 'Unsubscribe'} | tabarro3`,
    };
}

export default async function UnsubscribePage({
    searchParams,
}: UnsubscribePageProps) {
    const params = await searchParams;
    const token = params.token ?? '';
    const dict = await getDictionary();

    return <UnsubscribeForm token={token} dict={dict} />;
}
