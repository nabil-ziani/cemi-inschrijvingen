import { Dispatch, SetStateAction } from 'react'
import { Tooltip } from '@nextui-org/react'
import { EnrollmentWithStudentClass } from '@/utils/types';
import { UserX } from 'lucide-react';
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

interface DeleteTooltipProps {
    enrollment: EnrollmentWithStudentClass,
    disabled?: boolean,
    setSelectedStudent: Dispatch<SetStateAction<SelectedStudentType>>,
    setModalType: Dispatch<SetStateAction<ModalType>>,
    onOpen: () => void
}

const DeleteTooltip = ({ enrollment, setSelectedStudent, setModalType, onOpen, disabled = false }: DeleteTooltipProps) => {

    const handleOpen = () => {
        onOpen();
    }

    return (
        <Tooltip color="danger" content="Uitschrijven" isDisabled={disabled}>
            <span onClick={() => {
                setSelectedStudent({ id: enrollment.enrollmentid, type: enrollment.type, student: { id: enrollment.studentid, name: `${capitalize(enrollment.student.firstname)}`, payment_amount: enrollment.payment_amount } })
                setModalType('delete')
                handleOpen()
            }} className={`text-lg text-danger active:opacity-50 ${disabled ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}>
                <UserX strokeWidth={1} />
            </span>
        </Tooltip>
    )
}

export default DeleteTooltip