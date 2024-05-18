import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Form } from "@/components/Form";
import { SubmitButton } from "@/components/submit-button";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }
    // TODO: redirect to portal with overview of students
    return redirect("/protected");
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

          <h3 className="text-xl font-semibold">Login</h3>
          <p className="text-sm text-gray-500">
            Gebruik je mail en paswoord om in te loggen
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            await signIn(formData);
          }}
        >
          <SubmitButton
            formAction={signIn}
            className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2"
            pendingText="Signing In..."
          >
            Sign in
          </SubmitButton>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {' for free.'}
          </p>
        </Form>
      </div>
    </div>
  );
}
