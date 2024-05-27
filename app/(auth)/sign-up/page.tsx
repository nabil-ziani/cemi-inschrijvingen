import { SignUp } from "@/components/auth/SignUp";

export default function SignUpPage({ searchParams }: { searchParams: { msg: string } }) {

    return (
        <SignUp error={searchParams.msg} />
    );
}
