import { Button } from '@nextui-org/button';
import React from 'react'
import { SubmitButton } from './SubmitButton';
import { EnrollmentStatusEnum, EnrollmentWithStudentClass } from '@/utils/types';

interface EnrollmentButtonProps {
    enrollment: EnrollmentWithStudentClass,
    loading: boolean,
    type: string
}

const EnrollmentButton = ({ enrollment, loading, type }: EnrollmentButtonProps) => {

    // When navigating to enrollment page through sidebar, enrollment is null
    if (!enrollment) {
        return <SubmitButton text={loading ? '' : 'Inschrijven'} loading={loading} />
    }

    if (type == 'enroll') {
        if (!enrollment?.payment_complete) {
            return <Button variant='solid' isDisabled>Betaling onvoltooid</Button>
        }

        if (enrollment?.student.repeating_year && enrollment.passed === false) {
            return <Button variant='solid' isDisabled>Jaar herhaald en niet geslaagd</Button>
        }
    }

    if (type == 'update' || type == 'ref') {
        return <Button type='submit' color='primary' variant='solid'>Aanpassen</Button>
    }

    if (type == 'view') {
        if (enrollment?.completed) {
            return <Button variant='solid' isDisabled>Reeds ingeschreven</Button>
        }

        if (enrollment.status === EnrollmentStatusEnum.Enum.Uitgeschreven) {
            return <Button variant='solid' isDisabled>Uitgeschreven</Button>;
        }
    }

    return <SubmitButton text={loading ? '' : 'Herinschrijven'} loading={loading} />;
}

export default EnrollmentButton