import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { getEnrollmentsByYear } from '@/queries/get_enrollments_by_year'
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Students from './students';

export default async function Index() {
  const queryClient = new QueryClient()
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  await prefetchQuery(queryClient, getEnrollmentsByYear(supabase, '2023'))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Students />
    </HydrationBoundary>
  );
}
