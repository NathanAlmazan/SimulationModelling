import React from 'react';
import DashboardLayout from './DashboardLayout';
import LogoOnlyLayout from './LogoOnlyLayout';
import { useRouter } from 'next/router';

function BaseLayout({ children }) {
    const { pathname } = useRouter();
    const logoPath = ["/signin", "/404", "/signup", "/reset/password", "/reset/confirm/[accountId]", "/401"];

    if (logoPath.includes(pathname)) {
        return (
            <LogoOnlyLayout>
                <main>{children}</main>
            </LogoOnlyLayout>
        )
    }

    return (
        <DashboardLayout>
            <main>{children}</main>
        </DashboardLayout>
    )
}

export default BaseLayout
