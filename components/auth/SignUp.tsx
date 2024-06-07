'use client'

import { useEffect, useState } from 'react'
import Link from "next/link";
import { signUp } from '@/app/(auth)/actions'
import { SignUpForm, SignUpFormData } from "@/components/auth/SignUpForm";
import Image from "next/image";
import { SubmitButton } from "@/components/SubmitButton";
import { NOTIFICATION_TYPE, Notification } from '@/components/Notification';

export function SignUp({ error }: { error: string }) {
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        if (error) setErrorMsg(error)
    }, [error])

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
                {errorMsg && <Notification type={NOTIFICATION_TYPE.error} message='Er ging iets mis bij het registreren' />}

                <SignUpForm action={async (formData: SignUpFormData) => {
                    setLoading(true)
                    await signUp(formData)
                    setLoading(false)
                }}>
                    <SubmitButton text={loading ? 'Laden...' : 'Maak je account aan'} loading={loading} />

                    <p className="text-center text-sm text-gray-500">
                        {'Heb je al een account? '}
                        <Link href="/sign-in" className="font-semibold text-[#e18438]">
                            Login
                        </Link>
                        {''}
                    </p>
                </SignUpForm>
            </div>
        </div >
    )
}