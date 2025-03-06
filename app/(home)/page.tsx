import { BenefitsComponent } from '@/components/home/benefits';
import CriteriasComponent from '@/components/home/criterias';
import HeroComponent from '@/components/home/hero';
import MapComponent from '@/components/home/map';
import HowItWorksComponent from '@/components/home/how-it-works';
import { getDictionary, getLocale } from '@/i18n/get-dictionary';
import Partners from '@/components/home/partners';
import LatestBlogPosts from '@/components/blog/latest-blog-posts';

export default async function Page() {
    const dict = await getDictionary();
    const lang = await getLocale();
    const isRTL = lang === 'ar';

    return (
        <div className="-mt-8">
            <HeroComponent dict={dict} isRTL={isRTL} />
            <HowItWorksComponent dict={dict} />
            <LatestBlogPosts locale={lang} dictionary={dict} />
            <Partners dict={dict} />
            <BenefitsComponent dict={dict} />
            <CriteriasComponent dict={dict} />
            <MapComponent dict={dict} />
        </div>
    );
}
