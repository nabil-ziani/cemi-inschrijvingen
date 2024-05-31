'use client'

import { Fragment, useState } from 'react'
import { Dialog, Transition, TransitionChild } from '@headlessui/react'
import { Card, CardBody, CardHeader, Divider } from '@nextui-org/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'

export default function NotFoundPage() {
    const [open, setOpen] = useState(true)

    return (
        <Transition show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-[#fefefe] bg-opacity-75 transition-opacity" />
                </TransitionChild>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Card>
                                <CardHeader className='flex flex-col gap-5 m-auto'>
                                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <ExclamationTriangleIcon className="h-7 w-7 text-red-600" aria-hidden="true" />
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody className="text-center p-8">
                                    <h3 className="text-2xl font-bold mb-4">Error</h3>
                                    <p className="">
                                        Oeps, deze pagina bestaat niet...
                                    </p>
                                </CardBody>
                            </Card>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}