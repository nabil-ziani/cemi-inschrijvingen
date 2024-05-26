import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@nextui-org/button";
import { LogOutIcon } from "lucide-react";

export default async function AuthButton() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
  };

  return user ? (
    <div className="flex items-center gap-4">
      <form action={signOut}>
        <Button color="danger" variant="shadow" type="submit">
          <LogOutIcon className="mr-3 h-4 w-4" /> Afmelden
        </Button>
      </form>
    </div>
  ) : (
    <Link href="/sign-in" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
      Login
    </Link>
  );
}
