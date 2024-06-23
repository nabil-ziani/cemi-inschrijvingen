import { capitalize } from '@/lib/utils'
import { EnrollmentStatusEnum, EnrollmentWithStudentClass, Level } from '@/utils/types'
import { Card, CardHeader, Link } from '@nextui-org/react'
import React from 'react'

interface EnrollmentNoticeProps {
    enrollment: EnrollmentWithStudentClass,
    type: string,
    currentLevel: Level,
    newLevel: Level | undefined,
    newEnrollment?: EnrollmentWithStudentClass | null
}

const EnrollmentNotice = ({ enrollment, type, currentLevel, newLevel, newEnrollment }: EnrollmentNoticeProps) => {

    if (enrollment && type === 'enroll') {
        return (
            <Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
                <CardHeader className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <h2 className='mr-6 font-medium leading-none text-default-700'>
                            <span className='font-bold'>{capitalize(enrollment.student.firstname)}</span> zal worden ingeschreven in <span className='font-bold'>{newLevel?.name}</span>,
                            &nbsp; {enrollment.student?.gender == 'f' ? 'Ze' : 'Hij'} zat dit schooljaar in {currentLevel!.name} en is <span className={`${enrollment.passed ? 'text-green-800' : 'text-red-800'}`}>{enrollment.passed ? 'geslaagd' : 'niet geslaagd'}</span>
                        </h2>
                    </div>
                </CardHeader>
            </Card>
        )
    }

    // if (enrollment && type == 'view' && enrollment.status === EnrollmentStatusEnum.Enum.Uitgeschreven) {
    //     return (
    //         < Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
    //             <CardHeader className='flex justify-between items-center'>
    //                 <div className='flex items-center'>
    //                     <h2 className='mr-6 font-medium leading-none text-default-700'>
    //                         <div className='flex items-center w-full justify-end'>
    //                             <span className='font-bold'>{capitalize(enrollment.student.firstname)}</span>&nbsp; is uitgeschreven.
    //                         </div>
    //                     </h2>
    //                 </div>
    //             </CardHeader>
    //         </Card >
    //     )
    // }

    if (enrollment && type == 'view' && enrollment.status === EnrollmentStatusEnum.Enum.Ingeschreven) {
        return (
            < Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
                <CardHeader className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <h2 className='mr-6 font-medium leading-none text-default-700'>
                            <div className='flex items-center w-full justify-end'>
                                <span className='font-bold'>{capitalize(enrollment.student.firstname)}</span>&nbsp; is reeds heringeschreven.
                                &nbsp; <Link href={`/enrollment/${newEnrollment?.enrollmentid}?type=update`} underline="always">Bekijk de nieuwe inschrijving</Link>&nbsp; om aanpassingen te maken.
                            </div>
                        </h2>
                    </div>
                </CardHeader>
            </Card >
        )
    }

    return null
}

export default EnrollmentNotice