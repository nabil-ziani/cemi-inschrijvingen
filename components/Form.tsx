import React from "react";
import { Input } from "@nextui-org/react";
import { MailIcon } from '@/components/icons/MailIcon';
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/icons/EyeSlashFilledIcon";

export function Form({ action, children }: {
    action: any;
    children: React.ReactNode;
}) {
    const [isVisible, setIsVisible] = React.useState(false);
    const [value, setValue] = React.useState("");

    const toggleVisibility = () => setIsVisible(!isVisible);

    return (
        <form
            action={action}
            className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16"
        >
            <div>
                <Input
                    value={value}
                    type="email"
                    label="Email"
                    name="email"
                    variant="bordered"
                    onValueChange={setValue}
                    className="max-w-xs"
                    endContent={
                        <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                    }
                />
            </div>
            <div>
                <Input
                    label="Wachtwoord"
                    variant="bordered"
                    name="password"
                    endContent={
                        <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    className="max-w-xs"
                />
            </div>
            {children}
        </form>
    );
}