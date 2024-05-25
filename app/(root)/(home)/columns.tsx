'use client'

import RowActions from "@/components/RowActions"
import { Enrollment } from "@/queries/get_enrollments_by_year"
import { createColumnHelper } from "@tanstack/react-table"

const renderResult = (param: any) => {
    switch (param) {
        case true:
            return 'Geslaagd'
            break
        case false:
            return 'Niet geslaagd'
            break
        default:
            return 'N/A';
    }
}

const columnHelper = createColumnHelper<Enrollment>()

export const columns = [
    columnHelper.accessor('student.firstname', {
        header: 'Voornaam',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('student.lastname', {
        header: 'Familienaam',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('passed', {
        header: 'Resultaat',
        cell: ({ row }) => (
            renderResult(row)
        ),
    }),
    columnHelper.display({
        header: 'Acties',
        id: 'actions',
        cell: ({ row }) => (
            <RowActions row={row} />
        )
    })
]