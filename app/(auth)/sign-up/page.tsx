import Link from "next/link";
import { signUp } from '../actions'
import { Form } from "@/components/Form";
import { SubmitButton } from "@/components/submit-button";
import Image from "next/image";

export default function Login({ searchParams }: { searchParams: { message: string } }) {

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
                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                            {searchParams.message}
                        </p>
                    )}

                    <h3 className="text-xl font-semibold">Registratie</h3>
                    <p className="text-sm text-gray-500">
                        Maak een nieuw account aan
                    </p>
                </div>
                <Form
                    action={async (formData: FormData) => {
                        'use server';
                        await signUp(formData);
                    }}
                >
                    <SubmitButton formAction={signUp}>
                        Aanmaken
                    </SubmitButton>

                    <p className="text-center text-sm text-gray-500">
                        {'Heb je al een account? '}
                        <Link href="/sign-in" className="font-semibold text-[#e18438]">
                            Login
                        </Link>
                        {''}
                    </p>
                </Form>
            </div>
        </div>
    );
}
