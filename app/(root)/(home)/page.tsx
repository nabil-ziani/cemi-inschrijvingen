import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StudentsTable from '../../../components/StudentsTable';
import { Divider } from "@nextui-org/react";

export default async function Index() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const { data } = await supabase.from('enrollment').select(`*, student(*)`).eq('year', '2023').eq('status', 'Heringeschreven')

  return (
    <>
      <h1 className='text-3xl font-bold mb-5'>Schooljaar 2023-2024</h1>
      <Divider className="my-5" />
      <div className="flex w-full flex-col gap-8">
        <StudentsTable data={data} />
      </div>
    </>
  );
}
