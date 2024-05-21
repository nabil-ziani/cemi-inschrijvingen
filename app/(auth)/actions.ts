'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";

import { createClient } from '@/utils/supabase/server'

// TODO: validate inputs
export async function signIn(formData: FormData) {
    const supabase = createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
};

export async function signUp(formData: FormData) {
    const supabase = createClient()

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        }
    });

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}