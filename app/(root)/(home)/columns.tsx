'use client'

import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "student.firstname",
        header: "Voornaam",
    },
    {
        accessorKey: "student.lastname",
        header: "Familienaam",
    },
    {
        accessorKey: "passed",
        header: "Resultaat",
    },
    {
        accessorKey: "",
        header: "Acties"
    }
]