import { Button } from '@nextui-org/button';
import React from 'react'
import { SubmitButton } from './SubmitButton';
import { EnrollmentWithStudentClass } from '@/utils/types';

interface EnrollmentButtonProps {
    enrollment: EnrollmentWithStudentClass,
    loading: boolean
}

const EnrollmentButton = ({ enrollment, loading }: EnrollmentButtonProps) => {

    // When navigating to enrollment page through sidebar, enrollment is null
    if (!enrollment) {
        return <SubmitButton text={loading ? '' : 'Inschrijven'} loading={loading} />;
    }

    if (enrollment?.completed) {
        return <Button variant='solid' isDisabled>Reeds ingeschreven</Button>;
    }

    if (!enrollment?.payment_complete) {
        return <Button variant='solid' isDisabled>Betaling onvoltooid</Button>;
    }

    if (enrollment?.student.repeating_year) {
        return <Button variant='solid' isDisabled>Jaar herhaald en niet geslaagd</Button>;
    }

    return <SubmitButton text={loading ? '' : 'Herinschrijven'} loading={loading} />;
}

export default EnrollmentButton