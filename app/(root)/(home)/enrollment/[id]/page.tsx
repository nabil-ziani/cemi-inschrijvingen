import { Divider } from '@heroui/react'
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import EnrollmentForm from '@/components/EnrollmentForm';
import { capitalize } from '@/lib/utils';
import { EnrollmentWithStudentClass, Student } from '@/utils/types';

interface EnrollmentPageProps {
	params?: Promise<{
		id: string
	}>
	searchParams?: Promise<{
		type?: string
		siblingOf?: string
	}>
}

const EnrollmentPage = async ({ params, searchParams }: EnrollmentPageProps) => {
	const { id } = await params;
	const resolvedSearchParams = await searchParams;
	const type = resolvedSearchParams?.type;
	const siblingOf = resolvedSearchParams?.siblingOf;

	const supabase = await createClient();

	// --- Auth protect page ---
	const { data: { user } } = await supabase.auth.getUser();

	if (!user) return redirect("/auth/sign-in");

	// --- Get levels to prefill select with options ---
	const { data: levels, error: levelsError } = await supabase.from('level').select().order('name', { ascending: true })

	if (levelsError) throw new Error("Error fetching levels" + levelsError);

	if (type === 'sibling' && !siblingOf) {
		return redirect('/?sibling=1');
	}

	// --- Get old enrollment (2025) to prefill form with existing data ---
	// This will always be from year 2025, because user comes from table where only 2025-records are shown
	const getCurrentEnrollment = async (): Promise<EnrollmentWithStudentClass | null> => {
		// ID will be null when student is new (no 2025-enrollment)
		if (id === 'null') {
			return null
		} else {
			const { data, error: enrollmentError } = await supabase.from('enrollment').select(`*, student(*), class(*, level(*))`).eq('enrollmentid', id).limit(1).single()

			if (enrollmentError) throw new Error("Error fetching enrollments" + enrollmentError);

			return data;
		}
	}

	const getNewEnrollment = async (studentid: string): Promise<EnrollmentWithStudentClass | null> => {
		// ID will be null when student is new (no 2026-enrollment)
		if (id === 'null') {
			return null
		} else {
			const { data, error } = await supabase.from('enrollment').select(`*, student(*), class(*, level(*))`).eq('studentid', studentid).eq('year', 2026).limit(1).single()

			if (error) throw new Error("Error fetching new enrollment" + error);

			return data;
		}
	}

	const getSiblingStudent = async (): Promise<Student | null> => {
		if (!siblingOf) {
			return null;
		}

		const { data, error } = await supabase
			.from('student')
			.select('*')
			.eq('studentid', siblingOf)
			.limit(1)
			.single();

		if (error) throw new Error('Error fetching sibling student' + error);

		return data;
	}

	const enrollment = await getCurrentEnrollment()
	const student = enrollment?.student
	let newEnrollment: EnrollmentWithStudentClass | null = null;
	const siblingStudent = type === 'sibling' ? await getSiblingStudent() : null;

	if (enrollment && enrollment.completed) {
		newEnrollment = await getNewEnrollment(enrollment.studentid)
	}
		
	return (
		<>
			<div className="flex justify-between items-center">
				<h1 className='text-3xl font-bold'>
					{student
						? `Herinschrijving - ${capitalize(`${student.firstname} ${student.lastname}`)}`
						: siblingStudent
							? `Broer/zus inschrijven - ${capitalize(`${siblingStudent.firstname} ${siblingStudent.lastname}`)}`
							: 'Nieuwe inschrijving'}
				</h1>
			</div>
			<Divider className="my-5" />
			<EnrollmentForm levels={levels} enrollment={enrollment} newEnrollment={newEnrollment} siblingStudent={siblingStudent} />
		</>
	)
}
export default EnrollmentPage