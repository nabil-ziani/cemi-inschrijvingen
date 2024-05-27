import { TypedSupabaseClient } from '@/utils/types'

export type Enrollment = {
    enrollmentid: string;
    student: {
        firstname: string;
        lastname: string;
        email_1: string;
    } | null;
    payment_complete: boolean;
    payment_amount: number;
    passed: boolean | null;
}

export function getEnrollmentsByYear(client: TypedSupabaseClient, year: string) {
    return client
        .from('enrollment')
        .select(`
            enrollmentid,
            student(
                firstname, 
                lastname,
                email_1
            ),
            payment_complete,
            payment_amount, 
            passed 
        `)
        .eq('year', year)
        .throwOnError()
}