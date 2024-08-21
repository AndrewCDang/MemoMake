"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchemaType, PasswordSchema } from "@/schema/authSchema";
import FormInputField from "@/app/_components/input/formInputField";
import Button from "@/app/_components/(buttons)/styledButton";
import { resetPassword } from "@/app/_actions/resetPassword";
import PasswordRequirements from "../../passwordRequirements";
import { startTransition } from "react";
import SubmitMessage from "../../_components/submitResults/submitMessage";
import { useState } from "react";
import Link from "next/link";
import style from "./resetPassword.module.scss";

type ResetPasswordTypes = {
    success: boolean;
    message: string;
};

function ResetPasswordForm({ token }: { token: string }) {
    const [validated, setValidated] = useState<boolean | null>(null);
    const [message, setMessage] = useState<string>();

    const {
        getValues,
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<PasswordSchemaType>({
        resolver: zodResolver(PasswordSchema),
        mode: "onChange",
    });

    const resetPasswordHandler = (data: { password: string }) => {
        const password = data.password;
        startTransition(() => {
            resetPassword({ password, token }).then(
                (data: ResetPasswordTypes) => {
                    setMessage(data.message);
                    setValidated(true);
                }
            );
        });
    };

    return (
        <form
            className={style.resetForm}
            onSubmit={handleSubmit(resetPasswordHandler)}
        >
            {!validated && (
                <>
                    <FormInputField
                        id="resetPassword"
                        type="password"
                        object="password"
                        labelText="New password"
                        error={errors.password ? true : false}
                        errorMessage={errors.password && "Invalid Password"}
                        register={register}
                    />
                    <PasswordRequirements
                        errors={errors}
                        getValues={getValues}
                        setError={setError}
                    />
                    <Button text="Submit" />
                </>
            )}
            {validated !== null && (
                <SubmitMessage validated={validated} message={message} />
            )}
            {validated && (
                <Link href="/">
                    <Button text="Return to home" />
                </Link>
            )}
        </form>
    );
}

export default ResetPasswordForm;
