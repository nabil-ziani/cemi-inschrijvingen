"use client"

import { ColumnDef } from "@tanstack/react-table"
import { z } from "zod";
import validator from "validator";

// This type is used to define the shape of our data.
const GENDER = ['m', 'f'] as const

export const Student = z.object({
    studentid: z.string().uuid(),
    firstname: z.string(),
    lastname: z.string(),
    email_1: z.string().refine(validator.isEmail),
    email_2: z.string().refine(validator.isEmail),
    phone_1: z.string().refine(validator.isMobilePhone),
    phone_2: z.string().refine(validator.isMobilePhone),
    birthdate: z.string().date(),
    gender: z.enum(GENDER),
    street: z.string(),
    housenumber: z.string(),
    postalcode: z.string(),
    city: z.string()
});

export const columns: ColumnDef<Student>[] = [
    {
        accessorKey: "firstname",
        header: "Voornaam",
    },
    {
        accessorKey: "lastname",
        header: "Familienaam",
    },
    {
        accessorKey: "birthdate",
        header: "Geboortedatum",
    },
]