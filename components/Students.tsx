'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import StudentsTable from './StudentsTable'
import { EnrollmentWithStudentClass, Level } from '@/utils/types'
import toast from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'

interface StudentsProps {
    enrollments: EnrollmentWithStudentClass[],
    levels: Array<Level>
}

const Students = ({ enrollments, levels }: StudentsProps) => {
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["2024"]));
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState<Array<EnrollmentWithStudentClass>>(enrollments)

    const supabase = createClient();

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    useEffect(() => {
        try {
            const fetchData = async () => {
                const getEnrollments = async (year: string) => {
                    const { data, error } = await supabase.from('enrollment').select(`*, student(*), class(*)`).eq('year', year);
                    return data;
                }

                const enrollments = await getEnrollments(selectedValue);
                setLoading(false)
                setStudents(enrollments || []);
            }
            fetchData();

        } catch (e: any) {
            toast.error('Oeps, er ging iets mis bij het ophalen van de inschrijvingen')
        }
    }, [selectedKeys])

    return (
        <>
            <div className="flex gap-3">
                <h1 className='text-3xl font-bold mb-5'>Inschrijvingen</h1>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="flat"
                            className="capitalize text-md"
                        >
                            {selectedValue}
                        </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                        variant="flat"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                    >
                        <DropdownItem key="2024">2024-2025</DropdownItem>
                        <DropdownItem key="2025">2025-2026</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Divider className="my-5" />
            <div className="flex w-full flex-col gap-8">
                <StudentsTable enrollments={students} levels={levels} loading={loading} />
            </div>
        </>
    )
}

export default Students