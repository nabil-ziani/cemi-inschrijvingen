import { Divider } from '@nextui-org/react'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';
import { capitalize } from '@/lib/utils';
import { EnrollmentWithStudentClass } from '@/utils/types';

const EnrollmentPage = async ({ params: { id, type } }: { params: { id: string, type: 'enroll' | 'update' } }) => {
    const supabase = createClient();

    // --- Auth protect page ---
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/sign-in");

    // --- Get levels to prefill select with options ---
    const { data: levels, error: levelsError } = await supabase.from('level_duplicate').select()

    if (levelsError) throw new Error("Error fetching levels" + levelsError);

    // --- Get old enrollment (2023) to prefill form with existing data ---
    // This will always be from year 2023, because user comes from table where only 2023-records are shown
    const getCurrentEnrollment = async (): Promise<EnrollmentWithStudentClass | null> => {
        // ID will be null when student is new (no 2023-enrollment)
        if (id === 'null') {
            return null
        } else {
            const { data, error: enrollmentError } = await supabase.from('enrollment_duplicate').select(`*, student(*), class(*, level(*))`).eq('enrollmentid', id).single()

            if (enrollmentError) throw new Error("Error fetching enrollments" + enrollmentError);

            return data;
        }
    }

    const enrollment = await getCurrentEnrollment()
    const student = enrollment?.student

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>{student ? `${capitalize(`${student.firstname} ${student.lastname}`)}` : 'Nieuwe inschrijving'}</h1>
            </div>
            <Divider className="my-5" />
            <EnrollmentForm levels={levels} enrollment={enrollment} type={type} />
        </>
    )
}

export default EnrollmentPage