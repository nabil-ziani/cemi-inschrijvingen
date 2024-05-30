import { TypedSupabaseClient } from '@/utils/types'

// get only active students
export function getStudentById(client: TypedSupabaseClient, id: string) {
    return client
        .from('student')
        .select(`*`)
        .eq('studentid', id)
        .throwOnError()
}