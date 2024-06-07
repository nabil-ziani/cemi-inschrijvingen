'use client'

import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon";
import toast from "react-hot-toast";

type FormValues = {
    email: string
}

const ResetPassword = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [value, setValue] = useState("");

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<FormValues>({ mode: 'onChange' })
    const supabase = createClient()

    const resetPassword: SubmitHandler<FormValues> = async (formData) => {
        try {
            setLoading(true)
            // --- We can not verify if email exists based on response, so generic success message is displayed ---
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.href}update`,
            });

            if (error) {
                console.log(error)
                toast.error('Oeps, probeer het later opnieuw.')
            } else {
                toast.success('Indien er een account gelinkt is ontvang je een mail met verdere instructies!')
            }
        } catch (error) {
            toast.error('Oeps, probeer het later opnieuw.')
        } finally {
            setLoading(false)
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
                    <h3 className="text-xl font-semibold">Reset wachtwoord</h3>
                    <p className="text-sm text-gray-500">
                        Geef je e-mailadres in.
                    </p>
                </div>
                <form onSubmit={handleSubmit(resetPassword)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
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
                    <SubmitButton text={loading ? 'Laden...' : 'Reset wachtwoord'} loading={loading} />
                </form>
            </div>
        </div >
    )
}

export default ResetPassword