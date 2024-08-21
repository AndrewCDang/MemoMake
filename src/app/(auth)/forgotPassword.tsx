"use client";

import React, { useState } from "react";
import style from "./authForm.module.scss";
import FormInputField from "../_components/input/formInputField";
import { EmailSchema, EmailSchemaType } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/(buttons)/styledButton";
import CloseButton from "../_components/(buttons)/closeButton";
import CloseForgotPassword from "./closeForgotPassword";
import forgotPassword from "../_actions/forgotPassword";
import { startTransition } from "react";
import SubmitMessage from "./_components/submitResults/submitMessage";

function ForgotPassword() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<EmailSchemaType>({
        resolver: zodResolver(EmailSchema),
        mode: "onChange",
    });

    const [validated, setValidated] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState<string>();

    const forgotPasswordSubmit = (data: EmailSchemaType) => {
        startTransition(() => {
            forgotPassword(data).then((data) => {
                setValidated(data?.success);
                if (data?.message) {
                    setErrorMessage(data.message);
                }
            });
        });
        reset();
    };

    return (
        <form
            onSubmit={handleSubmit(forgotPasswordSubmit)}
            className={style.form}
        >
            {!validated && (
                <>
                    <FormInputField
                        id="forgot-email"
                        type="email"
                        labelText="Email"
                        object="email"
                        error={errors.email ? true : false}
                        errorMessage={errors.email && errors.email.message}
                        register={register}
                    />
                    <Button text="Submit" />
                </>
            )}
            {validated !== null && (
                <SubmitMessage validated={validated} message={errorMessage} />
            )}
        </form>
    );
}

export default ForgotPassword;
