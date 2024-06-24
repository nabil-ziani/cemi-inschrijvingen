import { Dispatch, SetStateAction } from 'react'
import { EnrollmentStatusEnum, EnrollmentWithStudentClass } from '@/utils/types'
import { Tooltip } from '@nextui-org/react';
import { EyeIcon } from './icons/EyeIcon';
import DeleteTooltip from './DeleteTooltip';
import { useRouter } from 'next/navigation';
import { Edit3, UserCheck } from 'lucide-react';
import { capitalize } from '@/lib/utils';

type ModalType = "delete" | "enroll" | "payment" | "fail"
type SelectedStudentType = {
    id: string;
    type?: string;
    student: {
        id: string;
        name: string;
        payment_amount: number;
    };
}

interface RowActionsProps {
    enrollment: EnrollmentWithStudentClass,
    setSelectedStudent: Dispatch<SetStateAction<SelectedStudentType>>,
    setModalType: Dispatch<SetStateAction<ModalType>>,
    onOpen: () => void
}

const RowActions = ({ enrollment, setSelectedStudent, setModalType, onOpen }: RowActionsProps) => {

    const router = useRouter()

    const handleOpen = () => {
        onOpen();
    }

    if (enrollment.year == 2024 && enrollment.status == EnrollmentStatusEnum.Enum.Ingeschreven) {
        return (
            <>
                <Tooltip content="Wijzigen">
                    <span onClick={() => router.push(`/enrollment/${enrollment.enrollmentid}?type=update`)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Edit3 strokeWidth={1} />
                    </span>
                </Tooltip>
                <DeleteTooltip enrollment={enrollment} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
            </>
        )
    }

    if (enrollment.year == 2023 && enrollment.completed) {
        return (
            <>
                <Tooltip content="Bekijken">
                    <span onClick={() => router.push(`/enrollment/${enrollment.enrollmentid}?type=view`)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <EyeIcon strokeWidth={1} />
                    </span>
                </Tooltip>
                <DeleteTooltip enrollment={enrollment} disabled={true} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
            </>
        )
    }

    if (enrollment.status == EnrollmentStatusEnum.Enum["Onder voorbehoud"]) {
        return (
            <>
                <Tooltip content="Wijzigen">
                    <span onClick={() => router.push(`/enrollment/${enrollment.enrollmentid}?type=ref`)} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                        <Edit3 strokeWidth={1} />
                    </span>
                </Tooltip>
                <DeleteTooltip enrollment={enrollment} disabled={true} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
            </>
        )
    }

    if (enrollment.status == EnrollmentStatusEnum.Enum.Uitgeschreven) {
        return (
            <>
                <Tooltip content="Inschrijven" isDisabled>
                    <span className="text-lg text-default-400 cursor-not-allowed opacity-40">
                        <UserCheck strokeWidth={1} />
                    </span>
                </Tooltip>
                <DeleteTooltip enrollment={enrollment} disabled={true} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
            </>
        )
    }

    return (
        <>
            <Tooltip content="Herinschrijven">
                <span onClick={() => {
                    if (enrollment.passed == null) {
                        setSelectedStudent({ id: enrollment.enrollmentid, type: enrollment.type, student: { id: enrollment.studentid, name: `${capitalize(enrollment.student.firstname)}`, payment_amount: enrollment.payment_amount } })
                        setModalType('enroll')
                        handleOpen()
                    } else {
                        router.push(`/enrollment/${enrollment.enrollmentid}?type=enroll`)
                    }
                }} className="text-lg text-default-400 cursor-pointer active:opacity-50">
                    <UserCheck strokeWidth={1} />
                </span>
            </Tooltip>
            <DeleteTooltip enrollment={enrollment} setSelectedStudent={setSelectedStudent} setModalType={setModalType} onOpen={onOpen} />
        </>
    )
}

export default RowActions