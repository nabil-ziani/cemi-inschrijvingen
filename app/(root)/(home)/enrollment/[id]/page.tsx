import { Divider } from '@nextui-org/react'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';
import { capitalize } from '@/lib/utils';
import { EnrollmentWithStudentClass } from '@/utils/types';

const EnrollmentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/sign-in");

    const { data: levels, error } = await supabase.from('level').select()

    if (error) {
        console.error('Error fetching levels:', error);
        return <div>Niveaus konden niet geladen worden</div>;
    }

    const getOldEnrollment = async (): Promise<EnrollmentWithStudentClass | null> => {
        // If ID is null then there is no existing student (new enrollment)
        // TODO: HANDLE - classID can be null when enrollment was from 2022
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

    // TODOS: op deze pagina kom je een nieuwe inschrijving maken voor year: 2024
    // 2 methodes te maken 'getOldEnrollment (2023) en makeNewEnrollment (2024)'

    const enrollment = await getOldEnrollment()
    const student = enrollment?.student

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>{student ? `${capitalize(`${student.firstname} ${student.lastname}`)}` : 'Nieuwe inschrijving'}</h1>
                {/* <Button>Some action</Button> */}
            </div>
            <Divider className="my-5" />
            <EnrollmentForm levels={levels} enrollment={enrollment} />
        </>
    )
}

export default EnrollmentPage