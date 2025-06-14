import { Divider } from '@nextui-org/react'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';
import { capitalize } from '@/lib/utils';
import { EnrollmentWithStudentClass } from '@/utils/types';

const EnrollmentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createClient();

    // --- Auth protect page ---
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return redirect("/auth/sign-in");

    // --- Get levels to prefill select with options ---
    const { data: levels, error: levelsError } = await supabase.from('level').select().order('name', { ascending: true })

    if (levelsError) throw new Error("Error fetching levels" + levelsError);

    // --- Get old enrollment (2024) to prefill form with existing data ---
    // This will always be from year 2024, because user comes from table where only 2024-records are shown
    const getCurrentEnrollment = async (): Promise<EnrollmentWithStudentClass | null> => {
        // ID will be null when student is new (no 2024-enrollment)
        if (id === 'null') {
            return null
        } else {
            const { data, error: enrollmentError } = await supabase.from('enrollment').select(`*, student(*), class(*, level(*))`).eq('enrollmentid', id).limit(1).single()

            if (enrollmentError) throw new Error("Error fetching enrollments" + enrollmentError);

            return data;
        }
    }

    const getNewEnrollment = async (studentid: string): Promise<EnrollmentWithStudentClass | null> => {
        // ID will be null when student is new (no 2024-enrollment)
        if (id === 'null') {
            return null
        } else {
            const { data, error } = await supabase.from('enrollment').select(`*, student(*), class(*, level(*))`).eq('studentid', studentid).eq('year', 2025).limit(1).single()

            if (error) throw new Error("Error fetching new enrollment" + error);

            return data;
        }
    }

    const enrollment = await getCurrentEnrollment()
    const student = enrollment?.student
    let newEnrollment: EnrollmentWithStudentClass | null = null;

    if (enrollment && enrollment.completed) {
        newEnrollment = await getNewEnrollment(enrollment.studentid)
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>{student ? `Herinschrijving - ${capitalize(`${student.firstname} ${student.lastname}`)}` : 'Nieuwe inschrijving'}</h1>
            </div>
            <Divider className="my-5" />
            <EnrollmentForm levels={levels} enrollment={enrollment} newEnrollment={newEnrollment} />
        </>
    )
}
export default EnrollmentPage