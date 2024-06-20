'use client'

import React, { useState } from "react";
import { Modal, ModalContent, ModalBody, ModalFooter, Button, Switch } from "@nextui-org/react";
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { createClient } from "@/utils/supabase/client";
import { Check, Euro, X } from "lucide-react";
import { toast } from 'react-hot-toast';
import { useRouter } from "next/navigation";
import { ClassTypeEnum } from '@/utils/types';

interface DeleteEnrollmentModalProps {
    isOpen: boolean,
    onClose: () => void,
    enrollment?: { id: string, type?: string, student: { id: string, name: string, payment_amount: number } }
    type: 'delete' | 'enroll' | 'payment' | 'fail'
}

const EnrollmentModal = ({ isOpen, onClose, enrollment, type }: DeleteEnrollmentModalProps) => {
    const [passedIsSelected, setPassedIsSelected] = useState(false);

    const supabase = createClient()
    const router = useRouter()

    if (!enrollment?.id) return

    const enrollStudentOut = async () => {
        try {
            const { data, error } = await supabase.from('enrollment').update({ status: 'Niet ingeschreven' }).eq('enrollmentid', enrollment.id).select()

            if (error) throw error;

            toast.success(`${enrollment.student.name} is uitgeschreven.`)
            router.refresh()
        } catch (error) {
            toast.error('Oeps, er is iets misgegaan tijdens het uitschrijven')
        }
    }

    const updateSchoolResult = async () => {
        try {
            const { error } = await supabase.from('enrollment').update({ passed: passedIsSelected }).eq('enrollmentid', enrollment.id).select()

            if (error) throw error;

            router.push(`/enrollment/${enrollment.id}?type=enroll`)
            toast.success(`Opgeslagen!`)
        } catch (error) {
            toast.error('Oeps, er lijkt iets verkeerd te zijn gegaan')
        }
    }

    const updatePayment = async () => {
        try {
            const { error } = await supabase.from('enrollment').update({
                payment_complete: true,
                payment_amount: enrollment.type == ClassTypeEnum.Enum.Weekend ? 220 : 110
            }).eq('enrollmentid', enrollment.id).select()

            if (error) throw error;

            router.refresh()
            toast.success(`Betaling verwerkt!`)

        } catch (error) {
            toast.error('Oeps, er lijkt iets verkeerd te zijn gegaan')
        }
    }

    const allowEnrollmentException = async () => {
        try {
            const { data, error } = await supabase.from('student').update({ repeating_year: false }).eq('studentid', enrollment.student.id).select()
            console.log(data)

            if (error) throw error;

            router.refresh()
            toast.success(`Uitzondering gemaakt!`)

        } catch (error) {
            toast.error('Oeps, er lijkt iets verkeerd te zijn gegaan')
        }
    }

    const handleAction = async () => {
        switch (type) {
            case 'delete':
                await enrollStudentOut()
                break;
            case 'enroll':
                await updateSchoolResult()
                break;
            case 'payment':
                await updatePayment()
                break;
            case 'fail':
                await allowEnrollmentException()
                break;
        }
        onClose();
    }

    const renderModalContent = () => {
        switch (type) {
            case 'delete':
                return (
                    <>
                        <ModalBody className="text-center">
                            <div className="flex justify-center mt-2">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Leerling uitschrijven</h3>
                            <p className="text-sm text-default-gray-500">
                                Ben je zeker dat je <span className="font-semibold">{enrollment?.student.name}</span> wil uitschrijven?
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-evenly">
                            <Button className="flex-1" onPress={onClose} variant="flat">
                                Nee, dat wil ik niet.
                            </Button>
                            <Button className="flex-1" color="danger" onPress={handleAction}>
                                Ja, uitschrijven!
                            </Button>
                        </ModalFooter>
                    </>
                );
            case 'enroll':
                return (
                    <>
                        <ModalBody className="text-center">
                            <div className="flex justify-center mt-2">
                                {passedIsSelected ? (
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <Check className="h-6 w-6 text-green-600" />
                                    </div>
                                ) : (
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                        <X className="h-6 w-6 text-red-600" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Leerling geslaagd?</h3>
                            <div className="flex items-center justify-center gap-3">
                                <h2 className="text-sm leading-none text-gray-500">
                                    Geef aan of <span className="font-bold">{enrollment?.student.name}</span> geslaagd is:
                                </h2>
                                <Switch
                                    isSelected={passedIsSelected}
                                    onValueChange={setPassedIsSelected}
                                    size="sm"
                                    color="primary"
                                    startContent={<Check />}
                                    endContent={<X />}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter className="flex justify-evenly">
                            <Button className="flex-1" onPress={onClose} variant="flat">
                                Ga terug
                            </Button>
                            <Button className="flex-1" color="primary" onPress={handleAction}>
                                Verdergaan
                            </Button>
                        </ModalFooter>
                    </>
                );
            case 'payment':
                return (
                    <>
                        <ModalBody className="text-center">
                            <div className="flex justify-center mt-2">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                    <Euro className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Betaling verwerken &nbsp;
                                <span className="text-gray-600">- €{enrollment.type == ClassTypeEnum.Enum.Weekend ? 220 : 110}</span>
                            </h3>
                            <p className="text-sm text-default-gray-500">
                                De betaling van <span className="font-semibold">{enrollment?.student.name}</span> is nog niet voltooid.
                                <br />
                                <span className="font-bold text-default-gray-500 mt-2">
                                    {enrollment.student.payment_amount == 0 && `Er is geen voorschot betaald. (Volledig bedrag: ${enrollment.type == ClassTypeEnum.Enum.Weekend ? 220 : 110})`}
                                    {enrollment.student.payment_amount > 0 && `Er is een voorschot betaald van €${enrollment.student.payment_amount}.`}
                                </span>
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-evenly">
                            <Button className="flex-1" onPress={onClose} variant="flat">
                                Annuleren
                            </Button>
                            <Button className="flex-1" color="primary" onPress={handleAction}>
                                Betaling bevestigen
                            </Button>
                        </ModalFooter>
                    </>
                );
            case 'fail':
                return (
                    <>
                        <ModalBody className="text-center">
                            <div className="flex justify-center mt-2">
                                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-12 sm:w-12">
                                    <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Beoordeling nodig</h3>
                            <p className="text-sm text-default-gray-500">
                                <span className="font-bold">{enrollment?.student.name}</span> heeft al twee keer hetzelfde niveau gevolgd.
                                <br />
                                <span className="text-sm text-default-gray-500 mt-5">
                                    Wilt u toch doorgaan met de inschrijving?
                                </span>
                            </p>
                        </ModalBody>
                        <ModalFooter className="flex justify-evenly">
                            <Button className="flex-1" onPress={onClose} variant="flat">
                                Sluiten
                            </Button>
                            <Button className="flex-1" color="primary" onPress={handleAction}>
                                Toch verdergaan
                            </Button>
                        </ModalFooter>
                    </>
                );
            default:
                return null;
        }
    }

    return (
        <>
            <Modal hideCloseButton={true} backdrop='blur' isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    {renderModalContent()}
                </ModalContent>
            </Modal>
        </>
    );
}

export default EnrollmentModal