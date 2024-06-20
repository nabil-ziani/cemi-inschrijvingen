'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { SubmitHandler } from 'react-hook-form'

export const signIn: SubmitHandler<any> = async (formData) => {
    const supabase = createClient();

    const email = formData.email as string;
    const password = formData.password as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        redirect(`/auth/sign-in?msg=${error.message}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
};

export const signUp: SubmitHandler<any> = async (formData) => {
    const supabase = createClient()

    const data = {
        email: formData.email as string,
        password: formData.password as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect(`/sign-up?msg=${error.message}`)
    }

    revalidatePath('/', 'layout')
    redirect('/')
}