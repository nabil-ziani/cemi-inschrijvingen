import { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react'
import React, { ReactNode } from 'react'

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "CEMI",
    description: "Website voor leerlingen in te schrijven",
};

const RootLayout = ({
    children,
}: Readonly<{
    children: ReactNode;
}>) => {
    return (
        <main className='light text-foreground bg-background'>
            {children}
            <Analytics />{' '}
        </main>
    );
}

export default RootLayout