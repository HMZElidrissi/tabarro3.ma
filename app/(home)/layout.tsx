import { getDictionary } from '@/i18n/get-dictionary';
import { DesktopNav } from '@/components/layout/desktop-nav';
import { MobileNav } from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import { UserProvider } from '@/auth';
import { getUser } from '@/auth/session';
import { getCurrentLanguage } from '@/actions/language';
import { languages } from '@/config/home';
import { switchLanguage } from '@/actions/language';
import SignupInvitation from '@/components/home/signup-invitation';

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const dict = await getDictionary();
    const userPromise = getUser();
    const currentLocale = await getCurrentLanguage();
    const isRTL = currentLocale === 'ar';

    return (
        <UserProvider userPromise={userPromise}>
            <div
                className="flex min-h-screen flex-col bg-gray-50"
                dir={isRTL ? 'rtl' : 'ltr'}
            >
                <header className="sticky top-0 z-50 w-full border-b bg-gray-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-8xl">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center">
                                {/* Mobile Navigation */}
                                <MobileNav
                                    dict={dict}
                                    initialLocale={currentLocale}
                                    languages={languages}
                                    onLanguageSwitch={switchLanguage}
                                />
                            </div>

                            {/* Desktop Navigation */}
                            <div className="hidden lg:flex flex-1 justify-center">
                                <DesktopNav
                                    dict={dict}
                                    initialLocale={currentLocale}
                                />
                            </div>

                            {/* Empty div for flex spacing in mobile view */}
                            <div className="w-10 lg:hidden"></div>
                        </div>
                    </div>
                </header>

                <SignupInvitation dict={dict.popup} isRTL={isRTL} />

                <main className="flex-1">{children}</main>

                <Footer dict={dict} />
            </div>
        </UserProvider>
    );
}
