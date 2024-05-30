import { Button, Divider } from '@nextui-org/react'

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';

const EnrollmentPage = async () => {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect("/sign-in");

    const { data, error } = await supabase.from('level').select()

    return (
        <>
            <div className="flex justify-between items-center">
                <h1 className='text-3xl font-bold'>Nieuwe inschrijving</h1>
                {/* <Button>Some action</Button> */}
            </div>
            <Divider className="my-5" />
            <EnrollmentForm data={data} />
        </>
    )
}

export default EnrollmentPage