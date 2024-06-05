'use client'

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import StudentsTable from '../../../components/StudentsTable';
import { Divider, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { EnrollmentWithStudent } from "@/utils/types";
import { toast } from 'react-hot-toast';

export default function Index() {
  const [loading, setLoading] = useState(true)
  const [selectedKeys, setSelectedKeys] = useState(new Set(["2023"]));
  const [data, setData] = useState<Array<EnrollmentWithStudent>>([])

  const supabase = createClient();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const getEnrollments = async (year: string) => {
          const { data } = await supabase.from('enrollment').select(`*, student(*)`).eq('year', year).eq('status', 'Heringeschreven');
          return data;
        }

        const enrollments = await getEnrollments(selectedValue);
        setLoading(false)
        setData(enrollments);
      }
      fetchData();

    } catch (e: any) {
      toast.error('Oeps, er ging iets mis bij het ophalen van de inschrijvingen')
    }
  }, [selectedKeys])

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

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
            aria-label="Single selection example"
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
        {data && <StudentsTable loading={loading} data={data} />}
      </div>
    </>
  );
}
