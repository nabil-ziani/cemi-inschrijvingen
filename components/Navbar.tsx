import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import {Avatar} from "@heroui/react";

export default async function Navbar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/auth/sign-in");
    }

    return (
        <nav className='flex fixed w-full bg-dark-1 px-6 py-4 lg:px-10 h-22.5'>
            <div className='flex justify-end items-center gap-5 w-full'>
                <Avatar isBordered color='primary' radius="full" showFallback name={user.email} />
            </div>
        </nav>
    )
}