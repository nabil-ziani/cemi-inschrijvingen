'use client'

import { useMemo, useState } from 'react'
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, User } from '@heroui/react'
import { EnrollmentWithStudentClass } from '@/utils/types'
import { capitalize } from '@/lib/utils'
import { SearchIcon } from './icons/SearchIcon'

interface SiblingEnrollmentModalProps {
	isOpen: boolean
	onClose: () => void
	enrollments: EnrollmentWithStudentClass[]
	onSelectStudent: (studentId: string) => void
}

const SiblingEnrollmentModal = ({ isOpen, onClose, enrollments, onSelectStudent }: SiblingEnrollmentModalProps) => {
	const [filterValue, setFilterValue] = useState('')

	const filteredEnrollments = useMemo(() => {
		const searchValue = filterValue.trim().toLowerCase()

		return enrollments.filter((enrollment) => {
			if (!enrollment.student) {
				return false
			}

			if (!searchValue) {
				return true
			}

			const fullName = `${enrollment.student.firstname} ${enrollment.student.lastname}`.toLowerCase()
			return fullName.includes(searchValue) || enrollment.student.email_1.toLowerCase().includes(searchValue)
		})
	}, [enrollments, filterValue])

	return (
		<Modal size='lg' hideCloseButton backdrop='blur' isOpen={isOpen} onClose={onClose}>
			<ModalContent>
				<ModalHeader className='flex text-xl mt-2'>Broer/zus inschrijven</ModalHeader>
				<ModalBody>
					<p className='text-sm text-default-600'>
						Gedeelde familiegegevens worden automatisch ingevuld.
					</p>
					<Input
						isClearable
						value={filterValue}
						onClear={() => setFilterValue('')}
						onValueChange={setFilterValue}
						placeholder='Zoek op naam of e-mail'
						startContent={<SearchIcon />}
					/>
					<div className='max-h-80 space-y-2 overflow-y-auto pr-1'>
						{filteredEnrollments.map((enrollment) => {
							if (!enrollment.student) {
								return null
							}

							return (
								<button
									key={enrollment.enrollmentid}
									type='button'
									onClick={() => onSelectStudent(enrollment.studentid)}
									className='flex w-full items-center rounded-xl border border-default-200 px-3 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5 hover:cursor-pointer'
								>
									<User
										name={capitalize(`${enrollment.student.firstname} ${enrollment.student.lastname}`)}
										description={enrollment.student.email_1}
									/>
								</button>
							)
						})}
						{filteredEnrollments.length === 0 && (
							<div className='rounded-xl border border-dashed border-default-300 px-3 py-6 text-center text-sm text-default-500'>
								Geen leerling gevonden voor deze zoekopdracht.
							</div>
						)}
					</div>
				</ModalBody>
				<ModalFooter>
					<Button variant='flat' onPress={onClose}>Sluiten</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	)
}

export default SiblingEnrollmentModal