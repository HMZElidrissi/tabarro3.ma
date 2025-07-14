import Link from 'next/link';
import AuthCard from '@/components/auth/auth-card';
import React from 'react';
import Image from 'next/image';

const Layout = async ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <div className="text-gray-900 antialiased">
                <AuthCard
                    logo={
                        <Link href="/">
                            <Image
                                src="/logo.svg"
                                alt="tabarro3"
                                width={200}
                                height={200}
                                className="my-5"
                            />
                        </Link>
                    }
                >
                    {children}
                </AuthCard>
            </div>
        </div>
    );
};

export default Layout;
