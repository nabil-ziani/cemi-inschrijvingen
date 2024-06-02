import { TypedSupabaseClient } from '@/utils/types'

// TODO: add status 'Uitgeschreven' in DB and set to that
export function unenrollStudent(client: TypedSupabaseClient, enrollmentid: string) {
    return client
        .from('enrollment')
        .update({ status: 'Niet ingeschreven' })
        .eq('year', '2023')
        .eq('enrollmentid', enrollmentid)
        .throwOnError()
}