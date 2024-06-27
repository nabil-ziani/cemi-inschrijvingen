import Students from '@/components/Students';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function Index() {

  const supabase = createClient()

  // --- Page Protection ---
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/sign-in')

  // --- Get Enrollments of 2023 ---
  const { data: enrollments, error: enrollmentsError } = await supabase.from('enrollment').select(`*, student(*), class(*)`).eq('year', '2023');
  if (enrollmentsError) throw new Error("Error fetching levels" + enrollmentsError);

  // --- Get levels to show them in table ---
  const { data: levels, error: levelsError } = await supabase.from('level').select().order('name', { ascending: true })
  if (levelsError) throw new Error("Error fetching levels" + levelsError);

  return (
    <Students enrollments={enrollments} levels={levels} />
  );
}
