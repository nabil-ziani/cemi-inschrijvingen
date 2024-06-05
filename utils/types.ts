import { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/utils/database.types'
import { SVGProps } from "react";
import { z } from "zod";

export type TypedSupabaseClient = SupabaseClient<Database>

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

export interface Enrollment {
    classid: string | null
    enrollmentid: string
    passed: boolean | null
    payment_amount: number
    payment_complete: boolean
    status: Database["public"]["Enums"]["enrollmentstatus"]
    studentid: string
    year: number
}

export interface Class {
    class_time: Database["public"]["Enums"]["classtime"]
    class_type: Database["public"]["Enums"]["classtype"]
    classid: string
    gender: Database["public"]["Enums"]["gender"]
    levelid: string
    naam: string
    year: number
}

export interface Student {
    birthdate: string | null
    city: string | null
    email_1: string
    email_2: string | null
    firstname: string
    gender: Database["public"]["Enums"]["gender"]
    homeAlone: boolean
    housenumber: string | null
    lastname: string
    phone_1: string
    phone_2: string | null
    postalcode: string | null
    remarks: string
    street: string | null
    studentid: string
}

export interface Level {
    levelid: string
    name: Database["public"]["Enums"]["leveltype"]
}

export interface EnrollmentWithStudent extends Enrollment {
    student: Student
}

export interface EnrollmentWithStudentClass extends Enrollment {
    student: Student | null
    class: Class | null
}

// FORM VALIDATION

export const EnrollmentStatusEnum = z.enum(["Heringeschreven", "Niet ingeschreven", "Onder voorbehoud"]);
export const ClassTimeEnum = z.enum(["VM", "MD", "NM"]);
export const ClassTypeEnum = z.enum(["Woensdag", "Zondag", "Weekend"]);
export const GenderEnum = z.enum(["m", "f"]);
export const LevelTypeEnum = z.enum(["Tamhiedi", "Niveau 1", "Niveau 2", "Niveau 3 - deel 1", "Niveau 3 - deel 2", "Niveau 4 - deel 1", "Niveau 4 - deel 2"]);

export const EnrollmentSchema = z.object({
    classid: z.string().nullable(),
    enrollmentid: z.string(),
    passed: z.boolean().nullable(),
    payment_amount: z.number(),
    payment_complete: z.boolean(),
    status: EnrollmentStatusEnum,
    studentid: z.string(),
    year: z.number().default(2024),
});

export const ClassSchema = z.object({
    class_time: ClassTimeEnum,
    class_type: ClassTypeEnum,
    classid: z.string(),
    gender: GenderEnum,
    levelid: z.string(),
    naam: z.string(),
    year: z.number(),
});

export const StudentSchema = z.object({
    birthdate: z.string().nullable(),
    city: z.string().nullable(),
    email_1: z.string().email(),
    email_2: z.string().email().nullable(),
    firstname: z.string(),
    gender: GenderEnum,
    homeAlone: z.boolean(),
    housenumber: z.string().nullable(),
    lastname: z.string(),
    phone_1: z.string(),
    phone_2: z.string().nullable(),
    postalcode: z.string().nullable(),
    remarks: z.string().nullable(),
    street: z.string().nullable(),
    studentid: z.string(),
});

export const LevelSchema = z.object({
    levelid: z.string(),
    name: LevelTypeEnum,
});

export interface EnrollmentContextProps {
    propertyForm: Enrollment | null
    updatePropertyForm: (property: Partial<Enrollment>) => void
}