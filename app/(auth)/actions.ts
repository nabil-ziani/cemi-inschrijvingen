'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function signIn(formData: FormData) {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        redirect('/sign-in?msg=invalid-credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/')
};

export async function signUp(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    console.log(data)
    const { error } = await supabase.auth.signUp(data)

    if (error) {
        redirect('/sign-up?msg=auth-error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}