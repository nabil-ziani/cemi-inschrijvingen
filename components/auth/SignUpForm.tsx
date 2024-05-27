'use client'

import React from "react";
import { Input } from "@nextui-org/react";
import { MailIcon } from '@/components/icons/MailIcon';
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface SignUpFormData {
    email: string;
    password: string;
    confirmPassword: string
}

interface FormProps {
    action: SubmitHandler<SignUpFormData>
    children: React.ReactNode
}

export function SignUpForm({ action, children }: FormProps) {
    const [passwordVisible, setPasswordVisible] = React.useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = React.useState(false);
    const [value, setValue] = React.useState("");

    const UserSchema: ZodType<SignUpFormData> = z.object({
        email: z.string().email({ message: 'Email is niet geldig' }),
        password: z.string().min(8, { message: "Wachtwoord te kort, minstens 8 karakters" }),
        confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Wachtwoord komt niet overeen",
        path: ["confirmPassword"],
    });

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
        resolver: zodResolver(UserSchema),
        mode: "onSubmit",
    });

    console.log(errors)

    const toggleVisibility = () => setPasswordVisible(!passwordVisible);
    const toggleConfirmVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

    return (
        <form onSubmit={handleSubmit(action)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
            <div>
                <Input
                    id="email"
                    value={value}
                    type="email"
                    label="Email"
                    variant="bordered"
                    onValueChange={setValue}
                    className="max-w-xs"
                    {...register('email')}
                    isInvalid={errors.email !== undefined}
                    errorMessage={errors.email?.message}
                    endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                />
            </div>
            <div>
                <Input
                    label="Wachtwoord"
                    variant="bordered"
                    {...register('password')}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {passwordVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={passwordVisible ? "text" : "password"}
                    isInvalid={errors.password !== undefined}
                    errorMessage={errors.password?.message}
                    className="max-w-xs"
                />
            </div>

            <div>
                <Input
                    label="Bevestig wachtwoord"
                    variant="bordered"
                    {...register('confirmPassword')}
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                            {confirmPasswordVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={confirmPasswordVisible ? "text" : "password"}
                    isInvalid={errors.confirmPassword !== undefined}
                    errorMessage={errors.confirmPassword?.message}
                    className="max-w-xs"
                />
            </div>
            {children}
        </form>
    );
}