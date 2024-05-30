'use client'

import { createClient } from "@/utils/supabase/client";
import { Enrollment, getEnrollmentsByYear } from '@/queries/get_enrollments_by_year'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useCallback, useMemo, useState } from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    Pagination,
    SortDescriptor,
    Selection,
    Tooltip,
    useDisclosure
} from "@nextui-org/react";
import { PlusIcon } from "@/components/icons/PlusIcon";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { columns, statusOptions } from "@/constants";
import { capitalize } from "@/lib/utils";
import { EyeIcon } from "@/components/icons/ViewIcon"
import { EditIcon } from "@/components/icons/EditIcon";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { formatCurrency } from "@/utils/numberUtils";
import DeleteEnrollmentModal from "@/components/DeleteEnrollmentModal";
import { useRouter } from "next/navigation";

// const statusColorMap: Record<string, ChipProps["color"]> = {
//     active: "success",
//     paused: "danger",
//     vacation: "warning",
// };

const INITIAL_VISIBLE_COLUMNS = ["firstname", "lastname", "passed", "payment_complete", "actions"];

export default function Students() {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<Selection>("all");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, student: { name: string } }>()
    const supabase = createClient()

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { data, error } = useQuery(getEnrollmentsByYear(supabase, '2023'))
    const router = useRouter()

    if (error) return

    // MODAL
    const handleOpen = () => {
        onOpen();
    }

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredEnrollments = [...data!];

        if (hasSearchFilter) {
            filteredEnrollments = filteredEnrollments.filter((enrollment) => {
                const { student } = enrollment;
                const filterValueLowerCase = filterValue.toLowerCase();

                return (
                    student?.firstname.toLowerCase().includes(filterValueLowerCase) ||
                    student?.lastname.toLowerCase().includes(filterValueLowerCase) ||
                    student?.email_1.toLowerCase().includes(filterValueLowerCase)
                );
            });
        }

        // if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
        //     filteredEnrollments = filteredEnrollments.filter((enrollment) =>
        //         Array.from(statusFilter).includes(enrollment.status),
        //     );
        // }

        return filteredEnrollments;
    }, [data, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: Enrollment, b: Enrollment) => {
            const first = a[sortDescriptor.column as keyof Enrollment] as number;
            const second = b[sortDescriptor.column as keyof Enrollment] as number;
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((enrollment: Enrollment, columnKey: React.Key) => {
        const cellValue = enrollment[columnKey as keyof Enrollment];

        switch (columnKey) {
            case "firstname":
                return (
                    <User
                        description={enrollment.student?.email_1}
                        name={`${enrollment.student?.firstname ? capitalize(enrollment.student?.firstname) : ''} ${enrollment.student?.lastname ? capitalize(enrollment.student?.lastname) : ''}`}
                    >
                    </User>
                );
            case "passed":
                return (
                    <div className="flex flex-col">
                        {/* <p className="text-bold text-small capitalize">{cellValue == null && 'N/A'}</p> */}
                        <p className="text-bold text-tiny capitalize text-default-400">{cellValue == null && 'N/A'}</p>
                    </div>
                );
            case "payment_complete":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" color={cellValue ? 'success' : 'danger'}>
                        {formatCurrency(enrollment.payment_amount)}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Wijzig">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Verwijder">
                            <span onClick={() => {
                                setSelectedStudent({ id: enrollment.enrollmentid, student: { name: `${enrollment.student?.firstname ? capitalize(enrollment.student?.firstname) : ''} ${enrollment.student?.lastname ? capitalize(enrollment.student?.lastname) : ''}` } })
                                handleOpen()
                            }} className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div >
                );
            default:
                return <span>{cellValue?.toString()}</span>;
        }
    }, []);

    const onNextPage = useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = useCallback((value?: string) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])

    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Zoek op naam..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Kolommen
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {/* <Button color="primary" endContent={<PlusIcon />}>
                            Nieuwe student
                        </Button> */}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Totaal: {data!.length} leerlingen</span>
                    <label className="flex items-center text-default-400 text-small">
                        Aantal rijen:&nbsp;
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                            defaultValue={10}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        statusFilter,
        visibleColumns,
        onSearchChange,
        onRowsPerPageChange,
        data!.length,
        hasSearchFilter,
    ]);

    const bottomContent = useMemo(() => {
        return (
            <div className="py-2 px-2 flex m-auto items-center">
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[70vh]",
                }}
                selectionMode="single"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSortChange={setSortDescriptor}
                // TODO: navigate to detail page
                onRowAction={(key) => router.push(`/student/${key}`)}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === "actions" ? "center" : "start"}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody className="h-full" emptyContent={"No users found"} items={sortedItems}>
                    {(item) => (
                        // Go to detail page onClick
                        <TableRow key={item.studentid} >
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            <DeleteEnrollmentModal isOpen={isOpen} onClose={onClose} enrollment={selectedStudent} />
        </>
    )
}