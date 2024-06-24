'use client'

import { Database } from "@/utils/database.types";
import { createClient } from "@/utils/supabase/client";
import { ClassTypeEnum, EnrollmentStatusEnum, EnrollmentWithStudentClass } from "@/utils/types";

export const enrollExistingStudent = async (enrollment: EnrollmentWithStudentClass, data: any, genderIsSelected: boolean) => {
    const supabase = createClient();

    // Update student
    const { data: studentData, error: studentError } = await supabase
        .from('student')
        .upsert({
            studentid: enrollment.studentid,
            firstname: data.firstname,
            lastname: data.lastname,
            gender: genderIsSelected ? 'f' : 'm',
            birthdate: data.birthdate.toString(),
            phone_1: data.phone_1,
            phone_2: data.phone_2,
            email_1: data.email_1,
            email_2: data.email_2,
            homeAlone: data.homeAlone,
            street: data.street,
            housenumber: data.housenumber,
            postalcode: data.postalcode,
            city: data.city,
            remarks: data.remarks
        }).select();

    if (studentError) throw studentError;

    const studentId = studentData[0].studentid;

    // Update 2023 enrollment 
    // Setting completed to true - enrollments which are completed will not be editable 
    const { error: enrollmentUpdateError } = await supabase
        .from('enrollment')
        .update({
            status: "Ingeschreven",
            completed: true
        }).eq('enrollmentid', enrollment.enrollmentid)
        .select();

    if (enrollmentUpdateError) throw enrollmentUpdateError;

    // --- Create NEW 2024 enrollment ---
    const { error: enrollmentError } = await supabase
        .from('enrollment')
        .insert({
            studentid: studentId,
            classid: null,
            year: 2024,
            passed: null,
            payment_amount: data.payment_amount,
            status: EnrollmentStatusEnum.Enum.Ingeschreven,
            levelid: data.level,
            payment_complete: data.classtype == ClassTypeEnum.Enum.Weekend ? data.payment_amount == 240 : data.payment_amount == 130,
            completed: false,
            type: data.classtype as Database["public"]["Enums"]["classtype"]
        })
        .select();

    if (enrollmentError) throw enrollmentError;

    return studentData[0]
}

export const enrollNewStudent = async (enrollment: EnrollmentWithStudentClass, data: any, genderIsSelected: boolean) => {
    const supabase = createClient();

    // Create new student
    const { data: studentData, error: studentError } = await supabase
        .from('student')
        .insert({
            firstname: data.firstname,
            lastname: data.lastname,
            gender: genderIsSelected ? 'f' : 'm',
            birthdate: data.birthdate.toString(),
            phone_1: data.phone_1,
            phone_2: data.phone_2,
            email_1: data.email_1,
            email_2: data.email_2,
            homeAlone: data.homeAlone,
            street: data.street,
            housenumber: data.housenumber,
            postalcode: data.postalcode,
            city: data.city,
            remarks: data.remarks
        }).select();

    if (studentError) throw studentError;

    const studentId = studentData[0].studentid;

    // There is no 2023 enrollment to update

    // --- Create NEW 2024 enrollment ---
    const { error: enrollmentError } = await supabase
        .from('enrollment')
        .insert({
            studentid: studentId,
            classid: null,
            year: 2024,
            passed: null,
            payment_amount: data.payment_amount,
            status: EnrollmentStatusEnum.Enum["Onder voorbehoud"],
            levelid: data.level,
            payment_complete: data.classtype == ClassTypeEnum.Enum.Weekend ? data.payment_amount == 240 : data.payment_amount == 130,
            completed: false,
            type: data.classtype as Database["public"]["Enums"]["classtype"]
        })
        .select();

    if (enrollmentError) throw enrollmentError;

    return studentData[0]
}

export const updateStudent = async (enrollment: EnrollmentWithStudentClass, data: any, genderIsSelected: boolean) => {
    const supabase = createClient();

    // Update student
    const { data: studentData, error: studentError } = await supabase
        .from('student')
        .update({
            firstname: data.firstname,
            lastname: data.lastname,
            gender: genderIsSelected ? 'f' : 'm',
            birthdate: data.birthdate.toString(),
            phone_1: data.phone_1,
            phone_2: data.phone_2,
            email_1: data.email_1,
            email_2: data.email_2,
            homeAlone: data.homeAlone,
            street: data.street,
            housenumber: data.housenumber,
            postalcode: data.postalcode,
            city: data.city,
            remarks: data.remarks
        }).eq('studentid', enrollment.studentid);

    if (studentError) throw studentError;

    // Update enrollment
    const { error: enrollmentUpdateError } = await supabase
        .from('enrollment')
        .update({
            payment_amount: data.payment_amount,
            status: EnrollmentStatusEnum.Enum.Ingeschreven,
            levelid: data.level,
            payment_complete: data.classtype == ClassTypeEnum.Enum.Weekend ? data.payment_amount == 240 : data.payment_amount == 130,
            completed: false,
            type: data.classtype as Database["public"]["Enums"]["classtype"]
        }).eq('enrollmentid', enrollment.enrollmentid)
        .select();

    if (enrollmentUpdateError) throw enrollmentUpdateError;

    return enrollment.student
}