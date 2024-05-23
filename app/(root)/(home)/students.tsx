'use client'

import { createClient } from "@/utils/supabase/client";
import { getEnrollmentsByYear } from '@/queries/get_enrollments_by_year'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { columns } from "./columns"
import { DataTable } from "./data-table";

export default function Students() {
    const supabase = createClient()

    const { data: enrollment, error } = useQuery(getEnrollmentsByYear(supabase, '2023'))

    if (error)
        return

    return (
        <div className="container mx-auto py-10">
            <DataTable columns={columns} data={enrollment} />
        </div>
    )
}