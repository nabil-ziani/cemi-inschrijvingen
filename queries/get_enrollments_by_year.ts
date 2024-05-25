import { TypedSupabaseClient } from '@/utils/types'

export type Enrollment = {
    enrollmentid: string;
    student: {
        firstname: string;
        lastname: string;
    } | null;
    payment_complete: boolean;
    passed: boolean | null;
}

export function getEnrollmentsByYear(client: TypedSupabaseClient, year: string) {
    return client
        .from('enrollment')
        .select(`
            enrollmentid,
            student(
                firstname, 
                lastname
            ),
            payment_complete, 
            passed 
        `)
        .eq('year', year)
        .throwOnError()
}