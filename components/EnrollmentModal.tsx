'use client'

import React, { useState } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button, Switch } from "@nextui-org/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { createClient } from "@/utils/supabase/client";
import { Check, X } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";

interface DeleteEnrollmentModalProps {
    isOpen: boolean,
    onClose: () => void,
    enrollment?: { id: string, student: { name: string } }
    type: 'delete' | 'update' | 'enroll'
}

const EnrollmentModal = ({ isOpen, onClose, enrollment, type }: DeleteEnrollmentModalProps) => {
    const [passedIsSelected, setPassedIsSelected] = useState(true);

    const supabase = createClient()
    const router = useRouter()

    if (!enrollment?.id) return

    const enrollStudentOut = async () => {
        try {
            const { data, error: enrollOutError } = await supabase.from('enrollment').update({ status: 'Niet ingeschreven' }).eq('enrollmentid', enrollment.id).select()

            if (enrollOutError) throw enrollOutError;

            toast.success(`${enrollment.student.name} is uitgeschreven.`)

        } catch (error) {
            toast.error('Oeps, er is iets misgegaan tijdens het uitschrijven')
        }
    }

    const updateSchoolResult = async () => {
        try {
            const { data, error: schoolResultError } = await supabase.from('enrollment').update({ passed: passedIsSelected }).eq('enrollmentid', enrollment.id).select()

            if (schoolResultError) throw schoolResultError;

            router.push(`/enrollment/${enrollment.id}?type=enroll`)
            toast.success(`Opgeslagen!`)

        } catch (error) {
            toast.error('Oeps, er lijkt iets verkeerd te zijn gegaan')
        }
    }

    return (
        <>
            {/* NEED TO USE SWITCH */}
            <Modal hideCloseButton={true} backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                {/* HEADER */}
                                <div className="flex justify-center mt-2">
                                    {type == 'enroll' ?
                                        passedIsSelected ?
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-12 sm:w-12">
                                                <Check className="h-6 w-6 text-green-600" />
                                            </div>
                                            :
                                            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                                <X className="h-6 w-6 text-red-600" />
                                            </div>
                                        :
                                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                        </div>
                                    }
                                </div>
                                {/* BODY */}
                                <h3 className="text-lg font-semibold text-gray-900">{type == 'enroll' ? 'Leerling geslaagd?' : 'Leerling uitschrijven'}</h3>
                                {type == 'enroll' ?
                                    <div className='flex items-center justify-center gap-3'>
                                        <h2 className='text-sm leading-none text-gray-500'>
                                            Geef aan of <span className='font-bold'>{enrollment?.student.name}</span> geslaagd is:
                                        </h2>
                                        <Switch
                                            isSelected={passedIsSelected}
                                            onValueChange={setPassedIsSelected}
                                            size='sm'
                                            color={'primary'}
                                            startContent={<Check />}
                                            endContent={<X />}
                                        />
                                    </div>
                                    :
                                    <p className="text-sm text-default-gray-500">
                                        Ben je zeker dat je <span className="font-semibold">{enrollment?.student.name}</span> wil uitschrijven?
                                    </p>}
                            </ModalBody>
                            <ModalFooter className="flex justify-evenly">
                                {type == 'enroll' ?
                                    <>
                                        <Button className="flex-1" onPress={onClose} variant="flat">
                                            Ga terug
                                        </Button>
                                        <Button className="flex-1" color='primary' onClick={updateSchoolResult}>
                                            Verdergaan
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <Button className="flex-1" onPress={onClose} variant="flat">
                                            Nee, dat wil ik niet.
                                        </Button>
                                        <Button className="flex-1" color="danger" onPress={onClose} onClick={enrollStudentOut}>
                                            Ja, uitschrijven!
                                        </Button>
                                    </>
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default EnrollmentModal