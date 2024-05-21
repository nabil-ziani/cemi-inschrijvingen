import Link from "next/link";
import { signIn } from '../actions'
import { Form } from "@/components/Form";
import { SubmitButton } from "@/components/submit-button";
import Image from "next/image";

export default function Login() {

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
            Gebruik je mail en paswoord om in te loggen
          </p>
        </div>
        <Form
          action={async (formData: FormData) => {
            'use server';
            await signIn(formData);
          }}
        >
          <SubmitButton formAction={signIn}>
            Login
          </SubmitButton>
          <p className="text-center text-sm text-gray-500">
            {"Nog geen account? "}
            <Link href="/sign-up" className="font-semibold text-[#e18438]">
              Registreer je hier.
            </Link>
          </p>
        </Form>
      </div>
    </div >
  );
}
