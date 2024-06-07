'use client'

import { useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import { SubmitButton } from "@/components/SubmitButton";
import { ZodType, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { EyeSlashFilledIcon } from '../icons/EyeSlashFilledIcon';
import { EyeFilledIcon } from '../icons/EyeFilledIcon';
import { Input } from '@nextui-org/react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { MailIcon } from '../icons/MailIcon';
import toast from 'react-hot-toast';

export function SignUp() {
    const [loading, setLoading] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [value, setValue] = useState("");

    const SignUpSchema = z.object({
        email: z.string().min(1, { message: 'Dit veld is verplicht' }).email({ message: 'Email is niet geldig' }),
        password: z.string().min(8, { message: "Wachtwoord te kort, minstens 8 karakters" }),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Wachtwoord komt niet overeen",
        path: ["confirmPassword"],
    });

    type SignUpFormData = z.infer<typeof SignUpSchema>;

    const supabase = createClient()
    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset } = useForm<SignUpFormData>({
        resolver: zodResolver(SignUpSchema),
        mode: "onBlur",
    });

    const toggleVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    const handleFormSubmit = async (formData: SignUpFormData) => {
        setLoading(true);
        try {
            const data = {
                email: formData.email as string,
                password: formData.password as string,
            }

            const { error } = await supabase.auth.signUp(data)

            if (error)
                toast.error('Verkeerd email of wachtwoord ingegeven');

            reset();
        } catch (e) {
            toast.error('Oeps, Er ging iets mis tijdens het inloggen');
        } finally {
            setLoading(false);
        }
    };

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
                    <h3 className="text-xl font-semibold">Registratie</h3>
                    <p className="text-sm text-gray-500">
                        Maak een nieuw account aan
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
                    </div>

                    <div>
                        <Input
                            label="Bevestig wachtwoord"
                            variant="bordered"
                            {...register('confirmPassword')}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                                    {confirmPasswordVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={confirmPasswordVisible ? "text" : "password"}
                            isInvalid={errors.confirmPassword !== undefined}
                            errorMessage={errors.confirmPassword?.message}
                            className="max-w-xs"
                        />
                    </div>
                    <SubmitButton text={loading ? 'Laden...' : 'Maak je account aan'} loading={loading} />

                    <p className="text-center text-sm text-gray-500">
                        {'Heb je al een account? '}
                        <Link href="/sign-in" className="font-semibold text-[#e18438]">
                            Login
                        </Link>
                        {''}
                    </p>
                </form>
            </div>
        </div >
    )
}