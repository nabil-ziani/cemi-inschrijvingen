import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Form } from "@/components/Form";
import { SubmitButton } from "@/components/submit-button";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
    const signUp = async (formData: FormData) => {
        "use server";

        const origin = headers().get("origin");
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const supabase = createClient();

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}/auth/callback`,
            }
        });

        if (error) {
            return redirect("/login?message=Could not authenticate user");
        }

        return redirect("/login?message=Check email to continue sign in process");
    };

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    {searchParams?.message && (
                        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                            {searchParams.message}
                        </p>
                    )}

                    <h3 className="text-xl font-semibold">Registreer</h3>
                    <p className="text-sm text-gray-500">
                        Maak een nieuw account aan met je mail en paswoord
                    </p>
                </div>
                <Form
                    action={async (formData: FormData) => {
                        'use server';
                        await signUp(formData);
                    }}
                >
                    <SubmitButton
                        formAction={signUp}
                        pendingText="Signing Up..."
                    >
                        Sign Up
                    </SubmitButton>

                    <p className="text-center text-sm text-gray-600">
                        {'Already have an account? '}
                        <Link href="/login" className="font-semibold text-gray-800">
                            Sign in
                        </Link>
                        {' instead.'}
                    </p>
                </Form>
            </div>
        </div>
    );
}
