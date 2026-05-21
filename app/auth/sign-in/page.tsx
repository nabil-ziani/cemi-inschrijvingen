import { SignIn } from "@/components/auth/SignIn";

export const metadata = {
  title: 'Login'
}

interface SignInPageProps {
  searchParams?: Promise<{
    msg: string
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { msg } = await searchParams || {};

  return (
    <SignIn error={msg} />
  );
}
