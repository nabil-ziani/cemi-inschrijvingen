'use client'

import { useState } from "react";
import { Input } from "@nextui-org/react";
import { MailIcon } from '@/components/icons/MailIcon';
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";
import { z, ZodType } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInFormData } from "./SignIn";

interface FormProps {
    action: SubmitHandler<SignInFormData>
    children: React.ReactNode
}

export function SignInForm({ action, children }: FormProps) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [value, setValue] = useState("");

    const UserSchema: ZodType<SignInFormData> = z.object({
        email: z.string().email({ message: 'Email is niet geldig' }),
        password: z.string().min(8, { message: "Wachtwoord te kort, minstens 8 karakters" }),
    })

    const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
        resolver: zodResolver(UserSchema),
        mode: "onSubmit",
    });

    const toggleVisibility = () => setPasswordVisible(!passwordVisible);

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
            {children}
        </form>
    );
}