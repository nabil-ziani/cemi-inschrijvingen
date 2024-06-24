'use client'

import { useEffect, useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Chip, Input, Switch, Divider, useDisclosure } from '@nextui-org/react'
import { CalendarDate, parseDate } from "@internationalized/date";
import { Checkbox } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { capitalize, getLevelById, getNextLevel } from '@/lib/utils';
import { DatePicker } from "@nextui-org/react";
import { ClassTypeEnum, EnrollmentWithStudentClass, Level } from '@/utils/types';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { useRouter } from 'next/navigation';
import { MailIcon } from './icons/MailIcon';
import { toast } from 'react-hot-toast';
import { parsePhoneNumber } from 'libphonenumber-js'
import { z } from "zod"
import EnrollmentModal from './EnrollmentModal';
import { useSearchParams } from 'next/navigation'
import EnrollmentButton from './EnrollmentButton';
import EnrollmentNotice from './EnrollmentNotice';
import { enrollExistingStudent, enrollNewStudent, sendMail, updateStudent } from '@/actions/enrollmentActions';

interface EnrollmentFormProps {
    levels: Array<Level> | null
    enrollment: EnrollmentWithStudentClass | null,
    newEnrollment?: EnrollmentWithStudentClass | null
}

// *** ZOD VALIDATION ***
const formSchema = z.object({
    firstname: z.string().min(1, { message: 'Verplicht veld' }),
    lastname: z.string().min(1, { message: 'Verplicht veld' }),
    gender: z.boolean(),
    birthdate: z.instanceof(CalendarDate),
    phone_1: z.string().min(1, { message: 'Verplicht veld' }).transform((value, ctx) => {
        const phoneNumber = parsePhoneNumber(value, {
            defaultCountry: 'BE'
        })

        if (!phoneNumber?.isValid()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Telefoonnummer is niet geldig",
            });
            return z.NEVER;
        }

        return phoneNumber.formatInternational();
    }),
    phone_2: z.union([z.literal(''), z.string().transform((value, ctx) => {
        // This field is optional
        if (!value) return

        const phoneNumber = parsePhoneNumber(value, {
            defaultCountry: 'BE'
        })

        if (!phoneNumber?.isValid()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Telefoonnummer is niet geldig",
            });
            return z.NEVER;
        }

        return phoneNumber.formatInternational();
    })]),
    email_1: z.string().min(1, { message: 'Verplicht veld' }).email({ message: 'Email is niet geldig' }),
    email_2: z.union([z.literal(''), z.string().email({ message: 'Email is niet geldig' })]),
    homeAlone: z.boolean(),
    street: z.string().min(1, { message: 'Verplicht veld' }),
    housenumber: z.string().min(1, { message: 'Verplicht veld' }),
    postalcode: z.string().min(1, { message: 'Verplicht veld' }),
    city: z.string().min(1, { message: 'Verplicht veld' }),
    remarks: z.union([z.literal(''), z.string()]),
    payment_amount: z.number(),
    level: z.string().min(1, { message: 'Verplicht veld' }),
    classtype: z.string().min(1, { message: 'Verplicht veld' })
});

const EnrollmentForm = ({ levels, enrollment, newEnrollment }: EnrollmentFormProps) => {
    const [aloneIsSelected, setAloneIsSelected] = useState(enrollment?.student?.homeAlone || false);
    const [genderIsSelected, setGenderIsSelected] = useState(enrollment?.student?.gender == 'f' ? true : false || false);
    const [selectedStudent, setSelectedStudent] = useState<{ id: string, type: string, student: { id: string, name: string, payment_amount: number } }>()
    const [modalType, setModalType] = useState<'delete' | 'enroll' | 'payment' | 'fail'>('enroll')
    const [valueClassType, setValueClassType] = useState<any>(new Set([enrollment?.type]))
    const [loading, setLoading] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter()
    const searchParams = useSearchParams()

    // MODAL
    const handleOpen = () => {
        onOpen();
    }

    const currentLevel = getLevelById(levels!, enrollment?.levelid!)
    const type = searchParams.get('type')

    let newLevel: Level | undefined;
    if (enrollment?.passed) {
        newLevel = getNextLevel(levels!, currentLevel?.levelid!)
    } else {
        newLevel = currentLevel
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: 'onSubmit',
        defaultValues: {
            firstname: enrollment?.student.firstname && capitalize(enrollment.student.firstname) || '',
            lastname: enrollment?.student.lastname && capitalize(enrollment.student.lastname) || '',
            birthdate: enrollment?.student.birthdate && parseDate(enrollment.student.birthdate) || new CalendarDate(2000, 1, 1),
            gender: enrollment && enrollment.student?.gender == 'f' ? true : false || false,
            phone_1: enrollment && enrollment.student?.phone_1 || '',
            phone_2: enrollment && enrollment.student?.phone_2 || '',
            email_1: enrollment && enrollment.student?.email_1 || '',
            email_2: enrollment && enrollment.student?.email_2 || '',
            homeAlone: enrollment && enrollment.student?.homeAlone || false,
            street: enrollment?.student.street && capitalize(enrollment.student.street) || '',
            housenumber: enrollment && enrollment.student?.housenumber || '',
            postalcode: enrollment && enrollment.student?.postalcode || '',
            city: enrollment?.student.city && capitalize(enrollment.student.city) || '',
            remarks: enrollment && enrollment.student?.remarks || '',
            level: enrollment && newLevel?.levelid || '',
            classtype: enrollment && enrollment.type || '',
            payment_amount: type === 'update' || type === 'view' ? enrollment?.payment_amount : 0
        }
    });

    // --- Make new enrollment for year 2024 ---
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // If enrollment is null, new student will be created otherwise linked student will be updated
            // If gender = true, send 'f' otherwise 'm'
            setLoading(true);

            if (type === 'enroll') {
                const student = await enrollExistingStudent(enrollment, data, genderIsSelected)
                router.replace('/')

                toast.success(`${student.firstname} is heringeschreven!`)
                setLoading(false)
            }

            if (type === 'new') {
                const student = await enrollNewStudent(enrollment, data, genderIsSelected)
                router.replace('/')

                toast.success(`${student.firstname} is ingeschreven!`)
                setLoading(false)
            }

            // --- SEND CONFIRMATION EMAIL ---
            const response = await sendMail('enroll', data, levels.find(lvl => lvl.levelid == data.level).name)
            if (!response.ok) {
                toast.error('Er ging iets mis bij het versturen van de mail!')
            } else {
                toast.success('Een bevestigingsmail is verstuurd!')
            }

            // We will not send a mail when student is updated
            if (type === 'update') {
                const student = await updateStudent(enrollment, data, genderIsSelected)
                router.replace('/')
                router.refresh()

                toast.success(`${student.firstname} is aangepast!`)
                setLoading(false)
            }
        } catch (error: any) {
            toast.error('Oeps, er ging iets mis bij het inschrijven!')
        }
    };

    useEffect(() => {
        if (enrollment && type == 'enroll') {
            if (!enrollment.payment_complete) {
                setSelectedStudent({ id: enrollment.enrollmentid, type: enrollment.type, student: { id: enrollment.studentid, name: `${capitalize(enrollment.student.firstname)}`, payment_amount: enrollment.payment_amount } })
                setModalType('payment')
                handleOpen()
            }
            else if (enrollment.student.repeating_year === true && enrollment.passed === false) {
                setSelectedStudent({ id: enrollment.enrollmentid, type: enrollment.type, student: { id: enrollment.studentid, name: `${capitalize(enrollment.student.firstname)}`, payment_amount: enrollment.payment_amount } })
                setModalType('fail')
                handleOpen()
            }
        }
    }, [enrollment])

    function getPaymentDescription(value, classType) {
        const fullAmount = enrollment?.year === 2023 ? 110 : 130;
        if (!value) return '';

        if (classType === ClassTypeEnum.Enum.Weekend) {
            if (value === 240) {
                return 'Volledig ✅';
            } else if (value > 0 && value < 240) {
                return 'Voorschot 👍';
            } else {
                return 'Teveel ❌';
            }
        } else {
            if (value === fullAmount) {
                return 'Volledig ✅';
            } else if (value > 0 && value < fullAmount) {
                return 'Voorschot 👍';
            } else {
                return 'Teveel ❌';
            }
        }
    }

    return (
        <>
            <EnrollmentNotice enrollment={enrollment} newEnrollment={newEnrollment} type={type} currentLevel={currentLevel} newLevel={newLevel} />

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card className='my-5 py-5 px-5 xl:max-w-[1800px]'>
                        <CardHeader className='flex justify-between items-center'>
                            <h2 className='font-semibold leading-none text-default-600 text-lg'>
                                Persoonlijke informatie
                            </h2>
                            <div>
                                <FormField
                                    control={form.control}
                                    name='gender'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <div className='flex gap-3 items-center'>
                                                    <Chip className={`${genderIsSelected ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                                                        {genderIsSelected ? 'Meisje' : 'Jongen'}
                                                    </Chip>
                                                    <Switch
                                                        isSelected={genderIsSelected}
                                                        onValueChange={setGenderIsSelected}
                                                        onChange={field.onChange}
                                                        size='md'
                                                        color='default'>
                                                    </Switch>
                                                </div>
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-6 mt-2">
                                {/* Voornaam - Familienaam - Geboortedatum */}
                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='firstname'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Voornaam'
                                                            labelPlacement='outside'
                                                            placeholder='Voornaam'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.firstname !== undefined}
                                                            errorMessage={form.formState.errors.firstname?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='lastname'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Familienaam'
                                                            labelPlacement='outside'
                                                            placeholder='Familienaam'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.lastname !== undefined}
                                                            errorMessage={form.formState.errors.lastname?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='birthdate'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <I18nProvider locale="nl-BE">
                                                            <DatePicker
                                                                isDisabled={enrollment?.completed}
                                                                isRequired
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholderValue={new CalendarDate(17, 11, 1997)}
                                                                label='Geboortedatum'
                                                                labelPlacement='outside'
                                                                className='text-sm font-medium leading-6'
                                                                color='default'
                                                                isInvalid={form.formState.errors.birthdate !== undefined}
                                                                errorMessage={form.formState.errors.birthdate?.message}
                                                            />
                                                        </I18nProvider>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Type Klas - Betaling - Telefoon 1 - Telefoon 2 */}
                                <div className="sm:col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='classtype'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            defaultSelectedKeys={enrollment?.type ? [enrollment.type] : []}
                                                            {...field}
                                                            label='Type klas'
                                                            labelPlacement='outside'
                                                            placeholder='Selecteer het klastype'
                                                            color='default'
                                                            className='text-sm font-medium leading-6'
                                                            onSelectionChange={setValueClassType}
                                                            isInvalid={form.formState.errors.classtype !== undefined}
                                                            errorMessage={form.formState.errors.classtype?.message}
                                                        >
                                                            {ClassTypeEnum.options.map((classType) => (
                                                                <SelectItem key={classType} description={classType == ClassTypeEnum.Enum.Weekend ? '€240' : '€130'}>
                                                                    {classType}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='payment_amount'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value.toString()}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                            type="number"
                                                            label='Betaling'
                                                            labelPlacement='outside'
                                                            placeholder='0.00'
                                                            description={getPaymentDescription(field.value, Array.from(valueClassType)[0])}
                                                            className='text-sm font-medium leading-6'
                                                            startContent={
                                                                <div className="pointer-events-none flex items-center">
                                                                    <span className="text-default-400 text-small">€</span>
                                                                </div>
                                                            }
                                                            color='default'
                                                            isInvalid={form.formState.errors.payment_amount !== undefined}
                                                            errorMessage={form.formState.errors.payment_amount?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='phone_1'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Telefoon 1'
                                                            labelPlacement='outside'
                                                            placeholder='+32 XXX XX XX XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.phone_1 !== undefined}
                                                            errorMessage={form.formState.errors.phone_1?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='phone_2'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Telefoon 2'
                                                            labelPlacement='outside'
                                                            placeholder='+32 XXX XX XX XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.phone_2 !== undefined}
                                                            errorMessage={form.formState.errors.phone_2?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Niveau - Email 1 - Email 2 - Alleen naar huis? */}
                                <div className="sm:col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='level'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            defaultSelectedKeys={newLevel?.levelid ? [newLevel.levelid] : []}
                                                            {...field}
                                                            label='Niveau'
                                                            labelPlacement='outside'
                                                            placeholder='Selecteer het niveau'
                                                            color='default'
                                                            className='text-sm font-medium leading-6'
                                                            isInvalid={form.formState.errors.level !== undefined}
                                                            errorMessage={form.formState.errors.level?.message}
                                                        >
                                                            {levels!.map((level) => (
                                                                <SelectItem key={level.levelid}>
                                                                    {level.name}
                                                                </SelectItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='email_1'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Email 1'
                                                            labelPlacement='outside'
                                                            placeholder='gebruiker@cemi-antwerp.be'
                                                            startContent={
                                                                <MailIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                                                            }
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.email_1 !== undefined}
                                                            errorMessage={form.formState.errors.email_1?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='email_2'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Email 2'
                                                            labelPlacement='outside'
                                                            placeholder='gebruiker@cemi-antwerp.be'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            startContent={
                                                                <MailIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                                                            }
                                                            isInvalid={form.formState.errors.email_2 !== undefined}
                                                            errorMessage={form.formState.errors.email_2?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-1 xl:col-span-1 flex flex-col items-center justify-center">
                                    <div className="mt-4">
                                        <FormField
                                            control={form.control}
                                            name='homeAlone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Checkbox
                                                            isDisabled={enrollment?.completed}
                                                            isSelected={aloneIsSelected}
                                                            onValueChange={setAloneIsSelected}
                                                            onChange={field.onChange}
                                                            checked={enrollment ? enrollment.student!.homeAlone : false}
                                                        >
                                                            Alleen naar huis?
                                                        </Checkbox>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Straat - Huisnummer - Postcode - Gemeente */}
                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='street'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Straat'
                                                            labelPlacement='outside'
                                                            placeholder='Straat'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.street !== undefined}
                                                            errorMessage={form.formState.errors.street?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <div className="mt-2">
                                        <FormField
                                            control={form.control}
                                            name='housenumber'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Huisnummer'
                                                            labelPlacement='outside'
                                                            placeholder='XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.housenumber !== undefined}
                                                            errorMessage={form.formState.errors.housenumber?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='postalcode'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Postcode'
                                                            labelPlacement='outside'
                                                            placeholder='XXXX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.postalcode !== undefined}
                                                            errorMessage={form.formState.errors.postalcode?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='city'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isDisabled={enrollment?.completed}
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Gemeente'
                                                            labelPlacement='outside'
                                                            placeholder='Gemeente'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                            isInvalid={form.formState.errors.city !== undefined}
                                                            errorMessage={form.formState.errors.city?.message}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Opermkingen */}
                                <div className="col-span-full">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='remarks'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            isDisabled={enrollment?.completed}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Geef opmerkingen hier in"
                                                            className="text-sm font-medium leading-6"
                                                            label='Opmerkingen'
                                                            labelPlacement='outside'
                                                            color='default'
                                                            isInvalid={form.formState.errors.remarks !== undefined}
                                                            errorMessage={form.formState.errors.remarks?.message}
                                                            description='Eventuele voorkeuren voor lestijden kunnen niet gegarandeerd worden!!'
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                        <CardFooter className='flex justify-end items-center'>
                            <EnrollmentButton enrollment={enrollment} loading={loading} type={type} />
                        </CardFooter>
                    </Card>
                </form>
            </Form>
            <EnrollmentModal isOpen={isOpen} onClose={onClose} enrollment={selectedStudent} type={modalType} />
        </>
    )
}

export default EnrollmentForm