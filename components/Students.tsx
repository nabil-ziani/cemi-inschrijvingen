'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import StudentsTable from './StudentsTable'
import { EnrollmentWithStudent } from '@/utils/types'
import toast from 'react-hot-toast'
import { createClient } from '@/utils/supabase/client'

interface StudentsProps {
    data: EnrollmentWithStudent[],
}

const Students = ({ data }: StudentsProps) => {
    const [selectedKeys, setSelectedKeys] = useState<any>(new Set(["2023"]));
    const [loading, setLoading] = useState(true)
    const [students, setStudents] = useState<Array<EnrollmentWithStudent>>(data)

    const supabase = createClient();

    const selectedValue = useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    useEffect(() => {
        try {
            const fetchData = async () => {
                const getEnrollments = async (year: string) => {
                    const { data } = await supabase.from('enrollment').select(`*, student(*)`).eq('year', year).eq('status', 'Heringeschreven');
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
                        <DropdownItem key="2023">2023-2024</DropdownItem>
                        <DropdownItem key="2024">2024-2025</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Divider className="my-5" />
            <div className="flex w-full flex-col gap-8">
                <StudentsTable data={students} loading={loading} />
            </div>
        </>
    )
}

export default Students