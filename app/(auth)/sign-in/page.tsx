import { SignIn } from "@/components/SignIn";

export default function SignInPage({ searchParams }: { searchParams: { msg: string } }) {
  return (
    <SignIn error={searchParams.msg} />
  );
}
