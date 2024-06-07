'use client'

import { useState } from 'react';
import { Card, CardBody, CardFooter, CardHeader, Chip, Input, Switch, Divider, Button } from '@nextui-org/react'
import { CalendarDate, parseDate } from "@internationalized/date";
import { Checkbox } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { capitalize, getLevelById, getNextLevel } from '@/lib/utils';
import { DatePicker } from "@nextui-org/react";
import { ClassTypeEnum, EnrollmentStatusEnum, EnrollmentWithStudentClass, Level } from '@/utils/types';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { createClient } from '@/utils/supabase/client';
import { SubmitButton } from './SubmitButton';
import { useRouter } from 'next/navigation';
import { MailIcon } from './icons/MailIcon';
import { toast } from 'react-hot-toast';

interface EnrollmentFormProps {
    levels: Array<Level> | null
    enrollment: EnrollmentWithStudentClass | null
}

// *** ZOD VALIDATION ***
const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.boolean(),
    birthdate: z.instanceof(CalendarDate),
    phone_1: z.string(),
    phone_2: z.union([z.literal(''), z.string()]),
    email_1: z.string().email(),
    email_2: z.union([z.literal(''), z.string().email()]),
    homeAlone: z.boolean(),
    street: z.string(),
    housenumber: z.string(),
    postalcode: z.string(),
    city: z.string(),
    remarks: z.union([z.literal(''), z.string()]),
    payment_amount: z.number(),
    level: z.string(),
    classtype: z.string()
});

const EnrollmentForm = ({ levels, enrollment }: EnrollmentFormProps) => {
    const [aloneIsSelected, setAloneIsSelected] = useState(enrollment?.student?.homeAlone || false);
    const [genderIsSelected, setGenderIsSelected] = useState(enrollment?.student?.gender == 'f' ? true : false || false);
    const [loading, setLoading] = useState(false)

    const supabase = createClient();
    const router = useRouter()

    const currentLevel = getLevelById(levels!, enrollment?.class?.levelid!)

    let newLevel: Level | undefined;
    if (enrollment?.passed) {
        newLevel = getNextLevel(levels!, currentLevel?.levelid!)
    } else {
        newLevel = currentLevel
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: enrollment && capitalize(enrollment?.student?.firstname!) || '',
            lastname: enrollment && capitalize(enrollment?.student?.lastname!) || '',
            birthdate: enrollment?.student?.birthdate && parseDate(enrollment?.student?.birthdate) || new CalendarDate(2000, 1, 1),
            gender: enrollment && enrollment?.student?.gender == 'f' ? true : false || false,
            phone_1: enrollment && enrollment?.student?.phone_1 || '',
            phone_2: enrollment && enrollment?.student?.phone_2 || '',
            email_1: enrollment && enrollment?.student?.email_1 || '',
            email_2: enrollment && enrollment?.student?.email_2 || '',
            homeAlone: enrollment && enrollment?.student?.homeAlone || false,
            street: enrollment && enrollment?.student?.street || '',
            housenumber: enrollment && enrollment?.student?.housenumber || '',
            postalcode: enrollment && enrollment?.student?.postalcode || '',
            city: enrollment && enrollment?.student?.city || '',
            remarks: enrollment && enrollment?.student?.remarks || '',
            payment_amount: enrollment && enrollment?.payment_amount || 0,
            level: enrollment && newLevel?.levelid || '',
            classtype: enrollment && enrollment?.class?.class_type || ''
        }
    });

    // --- Make new enrollment for year 2024 ---
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            // If enrollment is null, new student will be created otherwise linked student will be updated
            // If gender = true, send 'f' otherwise 'm'
            setLoading(true);

            const { data: studentData, error: studentError } = await supabase
                .from('student')
                .upsert({
                    studentid: enrollment ? enrollment.studentid : undefined,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    gender: genderIsSelected ? 'f' : 'm',
                    birthdate: data.birthdate.toString(),
                    phone_1: data.phone_1,
                    phone_2: data.phone_2,
                    email_1: data.email_1,
                    email_2: data.email_2,
                    homeAlone: data.homeAlone,
                    street: data.street,
                    housenumber: data.housenumber,
                    postalcode: data.postalcode,
                    city: data.city,
                    remarks: data.remarks
                }, { onConflict: 'studentid' })
                .select();

            if (studentError) throw studentError;

            const studentId = studentData[0].studentid;

            const { data: enrollmentData, error: enrollmentError } = await supabase
                .from('enrollment')
                .upsert({
                    enrollmentid: enrollment ? enrollment.enrollmentid : undefined,
                    studentid: studentId,
                    classid: null,
                    year: 2024,
                    passed: null,
                    payment_amount: data.payment_amount,
                    status: EnrollmentStatusEnum.Enum.Heringeschreven,
                    levelid: data.level,
                    payment_complete: data.classtype == ClassTypeEnum.Enum.Weekend ? data.payment_amount == 240 : data.payment_amount == 130,
                    completed: true
                }, { onConflict: 'enrollmentid' })
                .select();

            if (enrollmentError) throw enrollmentError;

            toast.success(`${studentData[0].firstname} is ingeschreven!`)
        } catch (error: any) {
            toast.error('Oeps, er ging iets mis bij het inschrijven!')
        } finally {
            setLoading(false)
            router.push('/')
        }
    };

    return (
        <>
            {enrollment && <Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
                <CardHeader className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <h2 className='mr-6 font-medium leading-none text-default-700'>
                            <span className='font-bold'>{capitalize(enrollment.student!.firstname)}</span> zal worden ingeschreven in <span className='font-bold'>{newLevel?.name}</span>,
                            &nbsp; {enrollment?.student?.gender ? 'Ze' : 'Hij'} zat dit schooljaar in {currentLevel!.name} en is <span className={`${enrollment.passed ? 'text-green-800' : 'text-red-800'}`}>{enrollment.passed ? 'geslaagd' : 'niet geslaagd'}</span>
                        </h2>
                    </div>
                </CardHeader>
            </Card>}
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Voornaam'
                                                            labelPlacement='outside'
                                                            placeholder='Voornaam'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Familienaam'
                                                            labelPlacement='outside'
                                                            placeholder='Familienaam'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                                isRequired
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                placeholderValue={new CalendarDate(17, 11, 1997)}
                                                                label='Geboortedatum'
                                                                labelPlacement='outside'
                                                                className='text-sm font-medium leading-6'
                                                                color='default'
                                                            />
                                                        </I18nProvider>
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Niveau - Betaling - Telefoon 1 - Telefoon 2 */}
                                <div className="sm:col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='level'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            isRequired
                                                            defaultSelectedKeys={newLevel?.levelid ? [newLevel.levelid] : []}
                                                            {...field}
                                                            label='Niveau'
                                                            labelPlacement='outside'
                                                            placeholder='Selecteer het niveau'
                                                            color='default'
                                                            className='text-sm font-medium leading-6'
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

                                <div className="col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='payment_amount'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            isRequired
                                                            value={field.value.toString()}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                            type="number"
                                                            label='Betaling'
                                                            labelPlacement='outside'
                                                            placeholder='0.00'
                                                            className='text-sm font-medium leading-6'
                                                            startContent={
                                                                <div className="pointer-events-none flex items-center">
                                                                    <span className="text-default-400 text-small">€</span>
                                                                </div>
                                                            }
                                                            color='default'
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Telefoon 1'
                                                            labelPlacement='outside'
                                                            placeholder='+32 XXX XX XX XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Telefoon 2'
                                                            labelPlacement='outside'
                                                            placeholder='+32 XXX XX XX XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Klastype - Email 1 - Email 2 - Alleen naar huis? */}
                                <div className="sm:col-span-1">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='classtype'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Select
                                                            isRequired
                                                            defaultSelectedKeys={enrollment?.class?.class_type ? [enrollment.class.class_type] : []}
                                                            {...field}
                                                            label='Type klas'
                                                            labelPlacement='outside'
                                                            placeholder='Selecteer het klastype'
                                                            color='default'
                                                            className='text-sm font-medium leading-6'
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

                                <div className="sm:col-span-2">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='email_1'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Straat'
                                                            labelPlacement='outside'
                                                            placeholder='Straat'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Huisnummer'
                                                            labelPlacement='outside'
                                                            placeholder='XX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Postcode'
                                                            labelPlacement='outside'
                                                            placeholder='XXXX'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            isRequired
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            type="text"
                                                            label='Gemeente'
                                                            labelPlacement='outside'
                                                            placeholder='Gemeente'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
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
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            placeholder="Geef eventuele opmerkingen hier in"
                                                            className="text-sm font-medium leading-6"
                                                            label='Opmerkingen'
                                                            labelPlacement='outside'
                                                            color='default'
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
                            {
                                enrollment?.completed ?
                                    <Button variant='solid' isDisabled>Reeds ingeschreven</Button>
                                    :
                                    <SubmitButton text={loading ? 'Laden...' : 'Herinschrijven'} loading={loading} />
                            }
                        </CardFooter>
                    </Card>
                </form>
            </Form >
        </>
    )
}

export default EnrollmentForm