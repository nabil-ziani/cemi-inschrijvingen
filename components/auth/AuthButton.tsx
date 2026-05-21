import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@heroui/react";
import { LogOutIcon } from "lucide-react";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/auth/sign-in");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <Button color="danger" variant="solid" type="submit">
          <LogOutIcon className="mr-3 h-4 w-4" /> Afmelden
        </Button>
      </form>
    </div>
  ) : (
    <Link href="/auth/sign-in" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
      Login
    </Link>
  );
}
