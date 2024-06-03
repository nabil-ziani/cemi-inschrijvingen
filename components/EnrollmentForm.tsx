'use client'

import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from '@nextui-org/react'
import { CalendarDate, parseDate } from "@internationalized/date";
import { Checkbox } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Check, X } from 'lucide-react';
import { capitalize, getLevelById, getNextLevel } from '@/lib/utils';
import { DatePicker } from "@nextui-org/react";
import { EnrollmentWithStudentClass, Level } from '@/utils/types';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Switch } from "@nextui-org/react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

interface EnrollmentFormProps {
    levels: Array<Level> | null
    enrollment: EnrollmentWithStudentClass | null
}

// *** ZOD VALIDATION ***
const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.date(),
    phone_1: z.string(),
    phone_2: z.string().optional(),
    email_1: z.string().email(),
    email_2: z.string().email().optional(),
    homeAlone: z.boolean(),
    street: z.string(),
    housenumber: z.string(),
    postalcode: z.string(),
    city: z.string(),
    remarks: z.string().optional(),
    level: z.string()
});

const EnrollmentForm = ({ levels, enrollment }: EnrollmentFormProps) => {
    const [aloneIsSelected, setAloneIsSelected] = useState(false);
    const [passedIsSelected, setPassedIsSelected] = useState(false);
    const [schoolResult, setSchoolResult] = useState<boolean | null>(null)

    // zodra je op de pagina komt gaan we kijken of de student al een resultaat heeft en dit goed zetten 

    const form = useForm<z.infer<typeof formSchema>>();
    // { resolver: zodResolver(formSchema) }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log('Clicked!')
            console.log(values)
            // // Update or insert into student table
            // const { data: studentData, error: studentError } = await supabase
            //     .from('student')
            //     .upsert({
            //         id: enrollment ? enrollment?.student?.id! : null,
            //         firstname: data.firstname,
            //         lastname: data.lastname,
            //         birthdate: data.birthdate,
            //         phone_1: data.phone1,
            //         phone_2: data.phone2,
            //         email_1: data.email1,
            //         email_2: data.email2,
            //         homeAlone: data.homealone,
            //         street: data.street,
            //         housenumber: data.houseNumber,
            //         postalcode: data.postalCode,
            //         city: data.city,
            //         remarks: data.remarks
            //     }, { onConflict: 'id' })
            //     .select();

            // if (studentError) throw studentError;

            // const studentId = studentData[0].id;

            // // Update or insert into enrollment table
            // const { data: enrollmentData, error: enrollmentError } = await supabase
            //     .from('enrollment')
            //     .upsert({
            //         id: enrollment ? enrollment.id : null,
            //         student_id: studentId,
            //         class_id: data.level,
            //         school_year: '2023-2024'
            //     }, { onConflict: 'id' })
            //     .select();

            // if (enrollmentError) throw enrollmentError;

            // alert('Enrollment updated successfully!');
        } catch (error: any) {
            console.error('Error updating enrollment:', error.message);
            alert('Failed to update enrollment');
        }
    };

    // enrollment should be the one from 2023 
    const currentLevel = getLevelById(levels!, enrollment?.class?.levelid!)

    let newLevel: Level | undefined;
    if (schoolResult) {
        newLevel = getNextLevel(levels!, currentLevel?.levelid!)
    } else {
        newLevel = currentLevel
    }

    return schoolResult !== null ? (
        <>
            {enrollment && <Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
                <CardHeader className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <h2 className='mr-6 font-medium leading-none text-default-700'>
                            <span className='font-bold'>{capitalize(enrollment.student!.firstname)}</span> zal worden ingeschreven in <span className='font-bold'>{newLevel?.name}</span>,
                            &nbsp; {enrollment?.student?.gender ? 'Ze' : 'Hij'} zat dit schooljaar in {currentLevel!.name} en is <span className={`${passedIsSelected ? 'text-green-800' : 'text-red-800'}`}>{passedIsSelected ? 'geslaagd' : 'niet geslaagd'}</span>
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
                                                            defaultValue={enrollment ? capitalize(enrollment.student!.firstname) : ''}
                                                            type="text"
                                                            name='firstname'
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
                                                            defaultValue={enrollment ? capitalize(enrollment.student!.lastname) : ''}
                                                            type="text"
                                                            name='lastname'
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
                                                                defaultValue={enrollment ? parseDate(enrollment.student!.birthdate!) : null}
                                                                placeholderValue={new CalendarDate(17, 11, 1997)}
                                                                name='birthdate'
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

                                {/* Niveau - Telefoon 1 - Telefoon 2 */}
                                <div className="sm:col-span-2">
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
                                                            name='level'
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
                                                            defaultValue={enrollment ? enrollment.student!.phone_1 : ''}
                                                            type="text"
                                                            name='phone_1'
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
                                                            defaultValue={enrollment && enrollment.student!.phone_2 || ''}
                                                            type="text"
                                                            name='phone_2'
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


                                {/* Email 1 - Email 2 - Alleen naar huis? */}
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
                                                            defaultValue={enrollment ? enrollment.student!.email_1 : ''}
                                                            type="text"
                                                            name='email_1'
                                                            label='Email 1'
                                                            labelPlacement='outside'
                                                            placeholder='gebruiker@cemi-antwerp.be'
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
                                                            defaultValue={enrollment && enrollment.student!.email_2 || ''}
                                                            type="text"
                                                            name='email_2'
                                                            label='Email 2'
                                                            labelPlacement='outside'
                                                            placeholder='gebruiker@cemi-antwerp.be'
                                                            className='text-sm font-medium leading-6'
                                                            color='default'
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2 xl:col-span-1 flex flex-col items-center justify-center">
                                    <div className="mt-4">
                                        <FormField
                                            control={form.control}
                                            name='homeAlone'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Checkbox
                                                            isSelected={aloneIsSelected} onValueChange={setAloneIsSelected}
                                                            checked={enrollment ? enrollment.student!.homeAlone : false}
                                                            name='homeAlone'
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
                                                            defaultValue={enrollment && enrollment.student!.street || ''}
                                                            type="text"
                                                            name='street'
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
                                                            defaultValue={enrollment && enrollment.student!.housenumber || ''}
                                                            type="text"
                                                            name='housenumber'
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
                                                            defaultValue={enrollment && enrollment.student!.postalcode || ''}
                                                            type="text"
                                                            name='postalcode'
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
                                                            defaultValue={enrollment && enrollment.student!.city || ''}
                                                            type="text"
                                                            name='city'
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

                                <div className="col-span-full">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name='remarks'
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            defaultValue={enrollment && enrollment.student!.remarks || ''}
                                                            placeholder="Geef eventuele opmerkingen hier in"
                                                            className="text-sm font-medium leading-6"
                                                            name='remarks'
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
                            <Button color="primary" variant="solid" type='submit'>
                                Herinschrijven
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form >
        </>
    ) : (
        <>
            {enrollment && <Card className='my-4 py-4 px-5 xl:max-w-[1800px]'>
                <CardHeader className='flex justify-between items-center'>
                    <div className='flex items-center'>
                        <h2 className='mr-6 font-medium leading-none text-default-700'>
                            Gelieve aan te geven of <span className='font-bold'>{capitalize(enrollment.student!.firstname)}</span> geslaagd is:
                        </h2>
                        <Switch
                            onValueChange={setPassedIsSelected}
                            size='lg'
                            color={'primary'}
                            startContent={<Check />}
                            endContent={<X />}
                        />
                        <p className={`ml-3 text-small ${passedIsSelected ? 'text-green-800' : 'text-red-800'}`}>{passedIsSelected ? "geslaagd" : "niet geslaagd"}</p>
                    </div>
                    <Button color="default" variant="flat" onClick={() => (setSchoolResult(passedIsSelected))}>
                        Ga verder
                    </Button>
                </CardHeader>
            </Card>}
        </>
    )
}

export default EnrollmentForm