'use client'

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch, Divider } from "@nextui-org/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { createClient } from "@/utils/supabase/client";
import { Check, GraduationCap, X } from "lucide-react";
import Link from 'next/link';
interface DeleteEnrollmentModalProps {
    isOpen: boolean,
    onClose: () => void,
    enrollment?: { id: string, student: { name: string } }
    type: 'delete' | 'update' | ''
}

const EnrollmentModal = ({ isOpen, onClose, enrollment, type }: DeleteEnrollmentModalProps) => {
    const [passedIsSelected, setPassedIsSelected] = useState(true);

    const supabase = createClient()

    if (!enrollment?.id) return

    const enrollStudentOut = async () => {
        const { data, error } = await supabase.from('enrollment').update({ status: 'Niet ingeschreven' }).eq('enrollmentid', enrollment.id).select()

        if (error) {
            console.log(error)
        }
    }

    const updateSchoolResult = async () => {
        // const { data, error } = await supabase.from('enrollment').update({ passed: passedIsSelected }).eq('enrollmentid', enrollment.id).select()
        console.log('Clicked!')
        // if (error) {
        //     console.log(error)
        // }
    }

    return (
        <>
            <Modal hideCloseButton={true} backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalBody className="text-center">
                                {/* HEADER */}
                                <div className="flex justify-center mt-2">
                                    {type == 'update' ?
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
                                <h3 className="text-lg font-semibold text-gray-900">{type == 'update' ? 'Leerling geslaagd?' : 'Leerling uitschrijven'}</h3>
                                {type == 'update' ?
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
                                {type == 'update' ?
                                    <>
                                        <Button className="flex-1" onPress={onClose} variant="flat">
                                            Ga terug
                                        </Button>
                                        <Button className="flex-1" color='primary' onClick={updateSchoolResult}>
                                            <Link href={`/enrollment/${enrollment.id}`}>
                                                Verdergaan
                                            </Link>
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