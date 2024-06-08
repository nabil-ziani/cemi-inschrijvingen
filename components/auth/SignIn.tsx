'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { SubmitButton } from "@/components/SubmitButton";
import Image from "next/image";
import toast from 'react-hot-toast';
import { EyeFilledIcon } from '../icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../icons/EyeSlashFilledIcon';
import { Button, Divider, Input } from '@nextui-org/react';
import { MailIcon } from '../icons/MailIcon';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { signIn } from '@/app/(auth)/actions';
import { createClient } from '@/utils/supabase/client';

interface SignInProps {
    error: string
}

export function SignIn({ error }: SignInProps) {
    const [loading, setLoading] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [value, setValue] = useState("");

    const SignInSchema = z.object({
        email: z.string().min(1, { message: 'Dit veld is verplicht' }).email({ message: 'Email is niet geldig' }),
        password: z.string().min(8, { message: "Wachtwoord te kort, minstens 8 karakters" }),
    })

    type SignInFormData = z.infer<typeof SignInSchema>;

    const supabase = createClient()
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignInFormData>({
        resolver: zodResolver(SignInSchema),
        mode: "onBlur",
    });

    const toggleVisibility = () => setPasswordVisible(!passwordVisible);

    useEffect(() => {
        if (error) {
            toast.error('Verkeerd email of wachtwoord ingegeven');
        }
    }, [error])

    const handleFormSubmit = async (formData: SignInFormData) => {
        setLoading(true);
        try {
            await signIn(formData)

            if (error) {
                toast.error('Verkeerd email of wachtwoord ingegeven');
            }
        } catch (e) {
            toast.error('Oeps, Er ging iets mis tijdens het inloggen');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `http://localhost:3000/auth/callback`
                }
            })
        } catch (e) {
            toast.error('Oeps, Er ging iets mis tijdens het inloggen');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-1 flex-col h-screen w-screen items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Image
                    src='/icons/logo.png'
                    width={200}
                    height={100}
                    alt='CEMI'
                    className="mx-auto h-12 w-auto"
                />
            </div>
            <div className="mt-10 z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <h3 className="text-xl font-semibold">Login</h3>
                    <p className="text-sm text-gray-500">
                        Gebruik je email en wachtwoord om in te loggen
                    </p>
                </div>
                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
                    <div>
                        <Input
                            id="email"
                            value={value}
                            type="email"
                            label="Email"
                            variant="bordered"
                            onValueChange={setValue}
                            className="max-w-xs"
                            {...register('email')}
                            isInvalid={errors.email !== undefined}
                            errorMessage={errors.email?.message}
                            endContent={
                                <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                            }
                        />
                    </div>
                    <div>
                        <Input
                            label="Wachtwoord"
                            variant="bordered"
                            {...register('password')}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                    {passwordVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={passwordVisible ? "text" : "password"}
                            isInvalid={errors.password !== undefined}
                            errorMessage={errors.password?.message}
                            className="max-w-xs"
                        />
                        <p className="text-sm text-gray-500 mt-2 underline hover:cursor-pointer" onClick={() => router.push('/password/reset')}>
                            Wachtwoord vergeten?
                        </p>
                    </div>
                    <SubmitButton text={loading ? 'Laden...' : 'Login'} loading={loading} />
                    <Divider />
                    <Button onClick={handleGoogleLogin}>Login met Google</Button>
                    <p className="text-center text-sm text-gray-500">
                        {"Nog geen account? "}
                        <Link href="/sign-up" className="font-semibold text-[#e18438]">
                            Registreer je hier.
                        </Link>
                    </p>
                </form>
            </div>
        </div >
    )
}