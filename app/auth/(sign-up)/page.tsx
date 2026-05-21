import { SignUp } from "@/components/auth/SignUp";

export const metadata = {
    title: 'Registreer'
}

interface SignUpPageProps {
    searchParams?: Promise<{
      msg: string
    }>
  }

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
    const { msg } = await searchParams || {};

    return (
        <SignUp error={msg} />
    );
}
