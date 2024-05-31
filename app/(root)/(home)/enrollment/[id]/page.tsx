import { Divider } from '@nextui-org/react'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';

const EnrollmentPage = async ({ params: { id } }: { params: { id: string } }) => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/sign-in");

    const { data: levels, error: levelError } = await supabase.from('level').select()
    const { data: classes, error: classError } = await supabase.from('class').select()

    // ClassID is null when enrollment was from 2022 (so do null-check)
    const getCompleteEnrollment = async () => {
        if (id == 'null') {
            return null
        } else {
            return await supabase.from('enrollment').select(`
            enrollmentid,
            studentid,
            classid,
            student(
                firstname, 
                lastname,
                birthdate,
                phone_1,
                phone_2,
                email_1,
                email_2,
                homeAlone,
                street,
                housenumber,
                postalcode, 
                city,
                remarks
            ),
            class(
                levelid,
                level(
                    levelid,
                    name
                )
            ),
            payment_complete,
            payment_amount, 
            passed 
            `).eq('enrollmentid', id)
        }
    }

    const enrollment = await getCompleteEnrollment()

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>Nieuwe inschrijving</h1>
                {/* <Button>Some action</Button> */}
            </div>
            <Divider className="my-5" />
            <EnrollmentForm levels={levels} enrollment={enrollment && enrollment.data![0]} />
        </>
    )
}

export default EnrollmentPage