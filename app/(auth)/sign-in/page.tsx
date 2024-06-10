import { SignIn } from "@/components/auth/SignIn";

export const metadata = {
  title: 'Login'
}

export default async function SignInPage({ searchParams }: { searchParams: { msg: string } }) {

  return (
    <SignIn error={searchParams.msg} />
  );
}
