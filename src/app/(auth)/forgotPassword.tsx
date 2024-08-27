"use client";

import React, { useState } from "react";
import style from "./authForm.module.scss";
import FormInputField from "../_components/input/formInputField";
import { EmailSchema, EmailSchemaType } from "@/schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/(buttons)/styledButton";
import forgotPassword from "../_actions/forgotPassword";
import SubmitMessage from "./_components/submitResults/submitMessage";
import LoadingCircle from "../_components/loadingUi/loadingCircle";

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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>();

    const forgotPasswordSubmit = async (data: EmailSchemaType) => {
        setIsLoading(true);

        try {
            const response = await forgotPassword(data);
            setValidated(response?.success);
            if (response?.message) {
                setErrorMessage(response.message);
            }
        } catch (error) {
            setErrorMessage("An unexpected error occurred.");
            setValidated(false);
        } finally {
            setIsLoading(false);
            reset();
        }
    };

    return (
        <form
            onSubmit={handleSubmit(forgotPasswordSubmit)}
            className={style.form}
        >
            {isLoading && (
                <div className={style.loadingWrap}>
                    <LoadingCircle />
                </div>
            )}
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
                    <Button disabled={isLoading} text="Submit" />
                </>
            )}
            {validated !== null && (
                <SubmitMessage validated={validated} message={errorMessage} />
            )}
        </form>
    );
}

export default ForgotPassword;
