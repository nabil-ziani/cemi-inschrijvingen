import React from 'react'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import Link from 'next/link'
import MobileNav from './MobileNav'
import AuthButton from './auth/AuthButton'

export default async function Navbar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/sign-in");
    }

    return (
        <nav className='flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'>
            <Link href='/' className='flex items-center gap-1'>
                <img
                    src='/icons/logo.png'
                    width={120}
                    height={60}
                    alt='CEMI'
                    className='max-sm:size-10'
                />
            </Link>

            <div className='flex-between gap-5'>
                <AuthButton />

                <MobileNav />
            </div>
        </nav>
    )
}