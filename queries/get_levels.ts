import { TypedSupabaseClient } from '@/utils/types'

// get levels
export function getLevels(client: TypedSupabaseClient) {
    return client.from('level').select()
}