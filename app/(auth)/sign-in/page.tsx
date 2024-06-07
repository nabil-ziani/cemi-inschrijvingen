import { SignIn } from "@/components/auth/SignIn";

export const metadata = {
  title: 'Login'
}

export default function SignInPage({ searchParams }: { searchParams: { msg: string } }) {
  return (
    <SignIn />
  );
}
