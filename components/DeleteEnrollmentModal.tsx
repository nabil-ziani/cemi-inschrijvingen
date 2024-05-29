import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { createClient } from "@/utils/supabase/client";
import { unenrollStudent } from "@/queries/unenroll_student";

interface DeleteEnrollmentModalProps {
    isOpen: boolean,
    onClose: () => void,
    enrollment?: { id: string, student: { name: string } }
}

const DeleteEnrollmentModal = ({ isOpen, onClose, enrollment }: DeleteEnrollmentModalProps) => {
    const supabase = createClient()

    if (!enrollment?.id) return

    const enrollStudentOut = async (id: string) => {
        const { data, error: updateError } = await supabase.from('enrollment').update({ status: 'Niet ingeschreven' }).eq('enrollmentid', id).eq('year', '2023').select()
        console.log(data)
    }

    return (
        <>
            <Modal hideCloseButton={true} backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 m-auto">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                                </div>
                            </ModalHeader>
                            <ModalBody className="text-center">
                                <h3 className="text-xl font-bold">Leerling Uitschrijven</h3>
                                <p className="text-sm">
                                    Ben je zeker dat je <span className="font-semibold">{enrollment?.student.name}</span> wil uitschrijven?
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button className="pr-5 pl-5" onPress={onClose} radius="full" variant="flat">
                                    Nee, dat wil ik niet.
                                </Button>
                                <Button className="pr-5 pl-5" color="danger" onPress={onClose} radius="full" onClick={() => enrollStudentOut(enrollment.id)}>
                                    Ja, uitschrijven!
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default DeleteEnrollmentModal