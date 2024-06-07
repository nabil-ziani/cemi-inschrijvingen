import { SignUp } from "@/components/auth/SignUp";

export const metadata = {
    title: 'Registreer'
}

export default function SignUpPage({ searchParams }: { searchParams: { msg: string } }) {
    return (
        <SignUp error={searchParams.msg} />
    );
}
