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

    if (!user) return redirect("/sign-in");

    // --- Get all levels to prefill select with options ---
    const { data: levels, error: levelsError } = await supabase.from('level').select()

    if (levelsError) {
        console.error('Error fetching levels:', levelsError);
    }

    // --- Get old enrollment to prefill form with existing data ---
    // This will always be from year 2023, because user comes from table where only 2023-records are shown
    const getCurrentEnrollment = async (): Promise<EnrollmentWithStudentClass | null> => {
        if (id === 'null') {
            return null
        } else {
            const { data, error } = await supabase.from('enrollment').select(`*, student(*), class(*, level(*))`).eq('enrollmentid', id).single()

            if (error) {
                console.error('Error fetching enrollment:', error);
                return null;
            }

            return data;
        }
    }

    const enrollment = await getCurrentEnrollment()
    const student = enrollment?.student

    // --- TODO: check if user has an enrollment of year 2022 ---
    // This would mean the user is repeating the same level -> if passed = false, enrollment should not be allowed (excluding exceptions)
    const isRepeatingLevel = async (studentid: string): Promise<boolean> => {
        //...
        return false
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>{student ? `${capitalize(`${student.firstname} ${student.lastname}`)}` : 'Nieuwe inschrijving'}</h1>
            </div>
            <Divider className="my-5" />
            <EnrollmentForm levels={levels} enrollment={enrollment} />
        </>
    )
}

export default EnrollmentPage