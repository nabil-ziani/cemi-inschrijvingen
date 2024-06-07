'use client'

import { useState } from "react";
import { SubmitButton } from "@/components/SubmitButton";
import Image from "next/image";
import { NOTIFICATION_TYPE, Notification } from '@/components/Notification';
import { SubmitHandler, useForm } from "react-hook-form";
import { createClient } from "@/utils/supabase/client";
import { Input } from "@nextui-org/react";
import { MailIcon } from "../icons/MailIcon";

type FormValues = {
    email: string
}

const ResetPassword = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const [value, setValue] = useState("");

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm<FormValues>({ mode: 'onChange' })
    const supabase = createClient()

    const resetPassword: SubmitHandler<FormValues> = async (formData) => {
        try {
            setLoading(true)
            // TODO: verify that email exists in our DB firstly
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.href}update`,
            });

            if (error) {
                setErrorMsg(error.message)
            } else {
                setSuccessMsg('Er is een mail verzonden met verdere instructies!');
            }
        } catch (error: any) {
            setErrorMsg(error.message)
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
                        Geef het e-mailadres in waarvoor je de wachtwoord wil resetten
                    </p>
                </div>
                {errorMsg && <Notification type={NOTIFICATION_TYPE.error} message='Verkeerd email of wachtwoord ingegeven' />}
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