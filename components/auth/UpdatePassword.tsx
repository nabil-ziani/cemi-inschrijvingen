'use client'

import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { z } from "zod";
import toast from "react-hot-toast";

const UpdatePassword = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [passwordShown, setPasswordShown] = useState(false);
    const [passwordConfirmShown, setPasswordConfirmShown] = useState(false);

    const UpdatePasswordSchema = z.object({
        password: z.string().min(8, { message: "Wachtwoord te kort, minstens 8 karakters" }),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Wachtwoord komt niet overeen",
        path: ["confirmPassword"],
    });

    type UpdatePasswordFormData = z.infer<typeof UpdatePasswordSchema>;

    const { register, handleSubmit, watch, formState: { errors, isValid, isSubmitting } } = useForm<UpdatePasswordFormData>({ mode: 'onBlur' })
    const router = useRouter();
    const supabase = createClient()

    const updatePassword: SubmitHandler<UpdatePasswordFormData> = async (formData) => {
        try {
            setLoading(true)
            const { error } = await supabase.auth.updateUser({
                password: formData.password,
            });

            if (error) {
                toast.error('Oeps, probeer het later opnieuw.')
            }

            // user will be authenticated and can go to home page
            router.replace('/');
        } catch (error: any) {
            toast.error('Oeps, probeer het later opnieuw.')
        } finally {
            setLoading(false)
        }
    }

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    const togglePasswordConfirmVisiblity = () => {
        setPasswordConfirmShown(passwordConfirmShown ? false : true);
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
                    <h3 className="text-xl font-semibold">Wachtwoord opnieuw instellen</h3>
                    <p className="text-sm text-gray-500">
                        Bevestig je nieuwe wachtwoord
                    </p>
                </div>
                <form onSubmit={handleSubmit(updatePassword)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
                    <div>
                        <Input
                            label="Wachtwoord"
                            variant="bordered"
                            {...register('password')}
                            endContent={
                                <button className="focus:outline-none" type="button" onClick={togglePasswordVisiblity}>
                                    {passwordShown ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={passwordShown ? "text" : "password"}
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
                                <button className="focus:outline-none" type="button" onClick={togglePasswordConfirmVisiblity}>
                                    {passwordConfirmShown ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                            type={passwordConfirmShown ? "text" : "password"}
                            isInvalid={errors.confirmPassword !== undefined}
                            errorMessage={errors.confirmPassword?.message}
                            className="max-w-xs"
                        />
                    </div>
                    <SubmitButton text={loading ? 'Laden...' : 'Bevestig wachtwoord'} loading={loading} />
                </form>
            </div>
        </div >
    )
}

export default UpdatePassword