import { Metadata } from 'next';
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
        <main className='bg-gray-50'>
            {/* Provider?? */}
            {children}
        </main>
    );
}

export default RootLayout