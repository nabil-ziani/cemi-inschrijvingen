import { SignUp } from "@/components/SignUp";

export default function SignUpPage({ searchParams }: { searchParams: { msg: string } }) {

    return (
        <SignUp error={searchParams.msg} />
    );
}
