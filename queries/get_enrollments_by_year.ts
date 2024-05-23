import { TypedSupabaseClient } from '@/utils/types'

export function getEnrollmentsByYear(client: TypedSupabaseClient, year: string) {
    return client
        .from('enrollment')
        .select(`
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