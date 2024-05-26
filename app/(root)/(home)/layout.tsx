import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { Metadata } from 'next';
import React, { ReactNode } from 'react'

const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
    metadataBase: new URL(defaultUrl),
    title: "CEMI",
    description: "CEMI app om een overzicht van de leerlingen te krijgen en inschrijvingen te beheren.",
    // icons: {
    //   icon:
    // }
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <main className='relative orange-light text-foreground bg-background'>
            <Navbar />
            <div className='flex'>
                <Sidebar />
                <section className="flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14">
                    <div className="w-full">
                        {children}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default RootLayout