'use client'

import { useCallback, useMemo, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, Chip, User, Pagination, SortDescriptor, Selection, useDisclosure } from "@nextui-org/react";
import { SearchIcon } from "@/components/icons/SearchIcon";
import { ChevronDownIcon } from "@/components/icons/ChevronDownIcon";
import { columns, statusOptions } from "@/constants";
import { capitalize, getLevelById } from "@/lib/utils";
import { formatCurrency } from "@/utils/numberUtils";
import { Enrollment, EnrollmentWithStudentClass, Level } from "@/utils/types";
import EnrollmentModal from "./EnrollmentModal";
import RowActions from "./RowActions";

const INITIAL_VISIBLE_COLUMNS = ["firstname", "lastname", "class_type", "level", "status", "actions"];

interface StudentsProps {
    enrollments: EnrollmentWithStudentClass[],
    levels: Array<Level>,
    loading: boolean
}

export default function StudentsTable({ enrollments, levels, loading }: StudentsProps) {
    const [filterValue, setFilterValue] = useState("");
    const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState<Selection>(new Set(["Niet heringeschreven", "Ingeschreven"]));
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "firstname",
        direction: "ascending",
    });
    const [page, setPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, type?: string, student: { id: string, name: string, payment_amount: number } }>()
    const [modalType, setModalType] = useState<'delete' | 'enroll' | 'payment' | 'fail'>('enroll')

    const { isOpen, onOpen, onClose } = useDisclosure();

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);

    const filteredItems = useMemo(() => {
        let filteredEnrollments = [...enrollments!];

        if (hasSearchFilter) {
            filteredEnrollments = filteredEnrollments.filter((enrollment) => {
                const { student: student } = enrollment;
                const filterValueLowerCase = filterValue.toLowerCase();

                return (
                    student?.firstname.toLowerCase().includes(filterValueLowerCase) ||
                    student?.lastname.toLowerCase().includes(filterValueLowerCase) ||
                    student?.email_1.toLowerCase().includes(filterValueLowerCase)
                );
            });
        }

        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredEnrollments = filteredEnrollments.filter((enrollment) => {
                return Array.from(statusFilter).includes(enrollment.status)
            })
        }

        return filteredEnrollments;
    }, [enrollments, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a: Enrollment, b: Enrollment) => {
            const first = a[sortDescriptor.column as keyof Enrollment];
            const second = b[sortDescriptor.column as keyof Enrollment];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const renderCell = useCallback((enrollment: EnrollmentWithStudentClass, columnKey: React.Key) => {
        const cellValue = enrollment[columnKey as keyof EnrollmentWithStudentClass];

        switch (columnKey) {
            case "firstname":
                return (
                    <User
                        description={enrollment.student?.email_1}
                        name={`${capitalize(enrollment.student.firstname)} ${capitalize(enrollment.student?.lastname)}`}
                    >
                    </User>
                );
            case "passed":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" radius="sm" color={cellValue == null ? 'default' : cellValue ? 'success' : 'danger'}>
                        {cellValue == null ? 'N/A' : cellValue ? 'Geslaagd' : 'Niet geslaagd'}
                    </Chip>
                );
            case "payment_complete":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" radius="sm" color={cellValue == true ? 'success' : 'danger'}>
                        {formatCurrency(enrollment.payment_amount)}
                    </Chip>
                );
            case "level":
                return (
                    <div className="flex gap-4">
                        {enrollment.levelid ?
                            <Chip
                                variant="flat"
                                color="primary"
                                radius="sm"
                            >
                                {getLevelById(levels, enrollment?.levelid)?.name}
                            </Chip>
                            :
                            <p className="text-bold text-sm text-default-400">Geen niveau</p>
                        }

                    </div>
                );
            case "class_type":
                return (
                    <div className="flex flex-col">
                        {enrollment.classid ? (
                            <>
                                <p className="text-bold text-sm capitalize">{enrollment.class?.class_type}</p>
                                <p className="text-bold text-sm capitalize text-default-400">{enrollment.class?.naam}</p>
                            </>
                        ) : (
                            <p className="text-bold text-sm text-default-400">Nog geen klas toegewezen</p>
                        )}
                    </div>
                )
            case "status":
                return (
                    <Chip className="capitalize" size="sm" variant="flat" radius="sm" color={cellValue == 'Ingeschreven' ? 'success' : cellValue == 'Onder voorbehoud' ? 'warning' : cellValue == 'Niet heringeschreven' ? 'default' : 'danger'}>
                        {cellValue.toString()}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-3">
                        <RowActions enrollment={enrollment} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
                    </div >
                );
            default:
                return <span>{cellValue?.toString()}</span>;
        }
    }, []);

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
                                        {status.name}
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
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Totaal: {enrollments!.length} leerlingen</span>
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
        enrollments!.length,
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
                <TableBody className="h-full" emptyContent={
                    loading ?
                        <div className="flex w-full h-full justify-center items-center">
                            <svg
                                className="animate-spin h-5 w-5 text-current"
                                fill="none"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                        : 'Geen inschrijvingen gevonden'
                } items={sortedItems}>
                    {(item) => (
                        <TableRow key={item.studentid}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            <EnrollmentModal
                isOpen={isOpen}
                onClose={onClose}
                enrollment={selectedStudent}
                type={modalType}
            />
        </>
    )
}