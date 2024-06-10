import Students from '@/components/Students';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Index() {

  const supabase = createClient()

  // --- Page Protection ---
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  // --- Get Enrollments of 2023 ---
  const getEnrollments = async () => {
    const { data } = await supabase.from('enrollment_duplicate').select(`*, student(*)`).eq('year', '2023').eq('status', 'Heringeschreven');

    return data;
  }

  const data = await getEnrollments()

  return (
    <Students data={data} />
  );
}
