'use client'

import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Switch, Divider } from "@nextui-org/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { createClient } from "@/utils/supabase/client";
import { Check, GraduationCap, X } from "lucide-react";

interface DeleteEnrollmentModalProps {
    isOpen: boolean,
    onClose: () => void,
    enrollment?: { id: string, student: { name: string } }
    type: 'delete' | 'update'
}

const EnrollmentModal = ({ isOpen, onClose, enrollment, type }: DeleteEnrollmentModalProps) => {
    const [passedIsSelected, setPassedIsSelected] = useState(false);

    const supabase = createClient()

    if (!enrollment?.id) return

    const enrollStudentOut = async () => {
        const { data, error } = await supabase.from('enrollment').update({ status: 'Niet ingeschreven' }).eq('enrollmentid', enrollment.id).select()

        if (error) {
            console.log(error)
        }
    }

    const updateSchoolResult = async () => {
        const { data, error } = await supabase.from('enrollment').update({ passed: passedIsSelected }).eq('enrollmentid', enrollment.id).select()

        if (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Modal hideCloseButton={true} backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 m-auto">
                                {type == 'update' ?
                                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <GraduationCap className="h-6 w-6 text-green-600" />
                                    </div>
                                    :
                                    <div className="mx-auto flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                    </div>
                                }
                            </ModalHeader>
                            <ModalBody className="text-center">
                                <h3 className="text-xl font-bold">{type == 'update' ? 'Leerling geslaagd?' : 'Leerling Uitschrijven'}</h3>
                                {type == 'update' ?
                                    <div className='flex items-center justify-center gap-5'>
                                        <h2 className='font-medium leading-none text-default-700'>
                                            Geef aan of <span className='font-bold'>{enrollment?.student.name}</span> geslaagd is:
                                        </h2>
                                        <Switch
                                            onValueChange={setPassedIsSelected}
                                            size='lg'
                                            color={'primary'}
                                            startContent={<Check />}
                                            endContent={<X />}
                                        />
                                        {/* <p className={`ml-3 text-small ${passedIsSelected ? 'text-green-800' : 'text-red-800'}`}>{passedIsSelected ? "geslaagd" : "niet geslaagd"}</p> */}
                                    </div>
                                    :
                                    <p className="mt-2 font-medium text-default-700">
                                        Ben je zeker dat je <span className="font-semibold">{enrollment?.student.name}</span> wil uitschrijven?
                                    </p>}
                            </ModalBody>
                            <Divider className="mt-4" />
                            <ModalFooter className="flex justify-evenly">
                                {type == 'update' ?
                                    <>
                                        <Button className="pr-5 pl-5" onPress={onClose} radius="full" variant="flat">
                                            Ga terug
                                        </Button>
                                        <Button color='primary' radius="full" onClick={updateSchoolResult}>
                                            Verdergaan
                                        </Button>
                                    </>

                                    :
                                    <>
                                        <Button className="pr-5 pl-5" onPress={onClose} radius="full" variant="flat">
                                            Nee, dat wil ik niet.
                                        </Button>
                                        <Button className="pr-5 pl-5" color="danger" onPress={onClose} radius="full" onClick={enrollStudentOut}>
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