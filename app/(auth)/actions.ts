'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { SubmitHandler } from 'react-hook-form';
// import { SignInFormData } from '@/components/auth/SignIn';
// import { SignUpFormData } from '@/components/auth/SignUpForm';

// export const signIn: SubmitHandler<SignInFormData> = async (formData) => {
//     const supabase = createClient();

//     const email = formData.email as string;
//     const password = formData.password as string;

//     const { error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//         redirect('/sign-in?msg=invalid-credentials')
//     }

//     revalidatePath('/', 'layout')
//     redirect('/')
// };

// export const signUp: SubmitHandler<SignUpFormData> = async (formData) => {
//     const supabase = createClient()

//     const data = {
//         email: formData.email as string,
//         password: formData.password as string,
//     }

//     const { error } = await supabase.auth.signUp(data)

//     if (error) {
//         redirect('/sign-up?msg=auth-error')
//     }

//     revalidatePath('/', 'layout')
//     redirect('/')
// }