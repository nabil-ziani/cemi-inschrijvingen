import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import MobileNav from './MobileNav'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AuthButton from './AuthButton'

export default async function Navbar() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    console.log(user)

    return (
        <nav className='flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 lg:px-10'>
            <Link href='/' className='flex items-center gap-1'>
                <Image
                    src='/icons/logo.svg'
                    width={32}
                    height={32}
                    alt='Yoom logo'
                    className='max-sm:size-10'
                />
                <p className='text-[26px] font-extrabold text-white max-sm:hidden'>Yoom</p>
            </Link>

            <div className='flex-between gap-5'>
                <AuthButton />
                <MobileNav />
            </div>
        </nav>
    )
}