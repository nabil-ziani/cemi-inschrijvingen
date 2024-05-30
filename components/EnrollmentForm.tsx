'use client'

import { useState } from 'react';
import { Button, Card, CardBody, CardFooter, CardHeader, DateInput, Divider, Input, select } from '@nextui-org/react'
import { CalendarDate } from "@internationalized/date";
import { Checkbox } from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { Select, SelectItem } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { EditIcon, SaveAllIcon, SaveIcon } from 'lucide-react';

type Level = {
    levelid: string
    name: "Tamhiedi" | "Niveau 1" | "Niveau 2" | "Niveau 3 - deel 1" | "Niveau 3 - deel 2" | "Niveau 4 - deel 1" | "Niveau 4 - deel 2"
}

const EnrollmentForm = ({ data }: { data: Array<Level> | null }) => {
    const [isSelected, setIsSelected] = useState(false);

    return (
        <Card className='my-5 py-5 px-5 xl:max-w-[1800px]'>
            <CardHeader className='flex justify-between items-center'>
                <h2 className='font-semibold leading-none text-default-600'>
                    Persoonlijke informatie
                </h2>
                <Button color="primary" variant="flat">
                    <EditIcon className="mr-2 h-4 w-4" /> Wijzigen
                </Button>
            </CardHeader>
            <Divider />
            <CardBody>
                <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-6 mt-2">
                    {/* Voornaam - Familienaam - Geboortedatum */}
                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='firstname'
                                label='Voornaam'
                                labelPlacement='outside'
                                placeholder='Voornaam'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='lastname'
                                label='Familienaam'
                                labelPlacement='outside'
                                placeholder='Familienaam'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div>
                            <I18nProvider locale="nl-BE">
                                <DateInput
                                    isRequired
                                    placeholderValue={new CalendarDate(17, 11, 1997)}
                                    name='birthdate'
                                    label='Geboortedatum'
                                    labelPlacement='outside'
                                    className='text-sm font-medium leading-6'
                                    color='default'
                                />
                            </I18nProvider>
                        </div>
                    </div>

                    {/* Niveau - Telefoon 1 - Telefoon 2 */}
                    <div className="sm:col-span-2">
                        <div>
                            <Select
                                className='text-sm font-medium leading-6'
                                isRequired
                                name='level'
                                label='Niveau'
                                labelPlacement='outside'
                                placeholder='Selecteer het niveau'
                                color='default'
                            >
                                {data!.map((level) => (
                                    <SelectItem key={level.levelid}>
                                        {level.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='phone1'
                                label='Telefoon 1'
                                labelPlacement='outside'
                                placeholder='+32 XXX XX XX XX'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                type="text"
                                name='phone2'
                                label='Telefoon 2'
                                labelPlacement='outside'
                                placeholder='+32 XXX XX XX XX'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>


                    {/* Email 1 - Email 2 - Alleen naar huis? */}
                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='email1'
                                label='Email 1'
                                labelPlacement='outside'
                                placeholder='gebruiker@cemi-antwerp.be'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                type="text"
                                name='email2'
                                label='Email 2'
                                labelPlacement='outside'
                                placeholder='gebruiker@cemi-antwerp.be'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1 flex flex-col">
                        <label htmlFor="homealone" className="block text-sm font-medium leading-6 text-default-600">
                            Aleen naar huis?
                        </label>
                        <div className="mt-2">
                            <Checkbox isSelected={isSelected} onValueChange={setIsSelected} aria-label='homealone' name='homealone'>
                                <span className="text-default-400 text-small">{isSelected ? "Ja" : "Nee"}</span>
                            </Checkbox>
                        </div>
                    </div>

                    {/* Straat - Huisnummer - Postcode - Gemeente */}
                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='street'
                                label='Straat'
                                labelPlacement='outside'
                                placeholder='Straat'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div className="mt-2">
                            <Input
                                isRequired
                                type="text"
                                name='houseNumber'
                                label='Huisnummer'
                                labelPlacement='outside'
                                placeholder='XX'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-1">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='postalCode'
                                label='Postcode'
                                labelPlacement='outside'
                                placeholder='XXXX'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <div>
                            <Input
                                isRequired
                                type="text"
                                name='city'
                                label='Gemeente'
                                labelPlacement='outside'
                                placeholder='Gemeente'
                                className='text-sm font-medium leading-6'
                                color='default'
                            />
                        </div>
                    </div>

                    <div className="col-span-full">
                        <div>
                            <Textarea
                                placeholder="Geef eventuele opmerkingen hier in"
                                className="text-sm font-medium leading-6"
                                label='Opmerkingen'
                                labelPlacement='outside'
                                color='default'
                            />
                        </div>
                    </div>
                </div>
            </CardBody>
            <CardFooter className='flex justify-end items-center'>
                <Button color="primary" variant="solid">
                    <SaveIcon className="mr-2 h-4 w-4" /> Opslaan
                </Button>
            </CardFooter>
        </Card>
    )
}

export default EnrollmentForm