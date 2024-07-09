"use client";

import React, { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import style from "./authForm.module.scss";
import FormInputField from "../_components/input/formInputField";
import {
    AuthSignUpType,
    AuthSignUp,
    PasswordSchema,
} from "../../schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/(buttons)/styledButton";
import { ZodError } from "zod";
import GenericButton from "../_components/(buttons)/genericButtton";
import CloseButton from "../_components/(buttons)/closeButton";
import { ValidIcon } from "./_components/validIcons";
import CloseSignUpModal from "./_hooks/closeSignUpModal";
import { signUp } from "../_actions/signUp";
import { startTransition } from "react";
import SubmitMessage from "./_components/submitResults/submitMessage";
import signInGoogle from "./signInGoogle";
import PasswordRequirements from "./passwordRequirements";

export interface DataValidationType {
    validated: boolean;
    error?: string;
    message?: string;
}

function SignUp() {
    const [validated, setValidated] = useState<boolean | undefined>(undefined);
    const [message, setMessage] = useState<string | undefined>(undefined);

    const {
        getValues,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
    } = useForm<AuthSignUpType>({
        resolver: zodResolver(AuthSignUp),
        mode: "onChange",
    });

    const submitHandler = (data: AuthSignUpType) => {
        startTransition(() => {
            signUp(data).then((value: DataValidationType) => {
                setValidated(value.validated);
                if (value.message) {
                    setMessage(value.message);
                }
                if (value.validated) {
                    reset();
                }
            });
        });
    };

    const signUpInstead = () => {};

    return (
        <section className={style.formContainer}>
            <section>
                <div className={style.authTop}>
                    <h4>Sign Up</h4>
                    <CloseSignUpModal>
                        <CloseButton />
                    </CloseSignUpModal>
                </div>
                <form
                    className={style.form}
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <FormInputField
                        id="signUp-id"
                        type="email"
                        placeholder="Email"
                        object="email"
                        error={errors.email ? true : false}
                        errorMessage={errors.email && errors.email.message}
                        register={register}
                    />
                    <FormInputField
                        id="signUp-userName"
                        type="text"
                        placeholder="User name"
                        object="userName"
                        error={errors.userName ? true : false}
                        errorMessage={
                            errors.userName && errors.userName.message
                        }
                        register={register}
                    />
                    <FormInputField
                        id="signUp-password"
                        type="password"
                        placeholder="Password"
                        object="password"
                        error={errors.password ? true : false}
                        errorMessage={
                            !errors.password?.message?.includes(
                                "Password required"
                            )
                                ? "Invalid password"
                                : "Password required"
                        }
                        register={register}
                    />
                    <FormInputField
                        id="signUp-repeat-password"
                        type="password"
                        placeholder="Repeat Password"
                        object="confirmPassword"
                        error={errors.confirmPassword ? true : false}
                        errorMessage={"Password does not match"}
                        register={register}
                    />
                    <PasswordRequirements
                        errors={errors}
                        getValues={getValues}
                        setError={setError}
                    />
                    {validated != undefined && (
                        <SubmitMessage
                            validated={validated}
                            message={message}
                        />
                    )}
                    <Button text="Sign Up" />
                </form>
                <div className={style.authBorder}>
                    <p>or</p>
                </div>
                <aside onClick={() => signInGoogle()}>
                    <div className={style.centerBtn}>
                        <GenericButton type={"button"}>
                            <div className={style.authBtn}>
                                <FcGoogle />
                                <label>Sign up with Google</label>
                            </div>
                        </GenericButton>
                    </div>
                </aside>
                <div className={style.authOther}>
                    <p onClick={signUpInstead}>
                        Have an account? <strong>Log In</strong> here
                    </p>
                </div>
            </section>
        </section>
    );
}

export default SignUp;
