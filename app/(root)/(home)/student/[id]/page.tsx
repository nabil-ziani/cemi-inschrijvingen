import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getStudentById } from '@/queries/get_student_by_id';
import { Divider } from '@nextui-org/react';
import Student from './student';

const StudentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const queryClient = new QueryClient()
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    await prefetchQuery(queryClient, getStudentById(supabase, id))

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <h1 className='text-3xl font-bold mb-5'>Schooljaar 2023-2024</h1>
            <Divider className="my-5" />
            <div className="flex w-full flex-col gap-8">
                <Student id={id} />
            </div>
        </HydrationBoundary>
    )
}

export default StudentPage