'use client'

import { createClient } from "@/utils/supabase/client";
import { getEnrollmentsByYear } from '@/queries/get_enrollments_by_year'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "./columns";

export default function Students() {
    const supabase = createClient()

    const { data, error } = useQuery(getEnrollmentsByYear(supabase, '2023'))

    if (error)
        return

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Inschrijvingen 24-25</CardTitle>
                {/* <div className="flex justify-between">
                    <div />
                    <div className="flex-nowrap">
                        <Form />
                    </div>
                </div> */}
            </CardHeader>
            <CardContent>
                <DataTable data={data} columns={columns} />
            </CardContent>
        </Card>
    )
}