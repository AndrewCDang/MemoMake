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
import GenericButton from "../_components/(buttons)/genericButtton";
import { signUp } from "../_actions/signUp";
import { startTransition } from "react";
import SubmitMessage from "./_components/submitResults/submitMessage";
import signInGoogle from "./signInGoogle";
import PasswordRequirements from "./passwordRequirements";
import { useLogInModal } from "../_hooks/useLogIn";
import { useSignUpModal } from "../_hooks/useSignUp";
import { set } from "zod";
import LoadingCircle from "../_components/loadingUi/loadingCircle";

export interface DataValidationType {
    validated: boolean;
    error?: string;
    message?: string;
}

function SignUp() {
    const { showLogInModal } = useLogInModal();
    const { removeSignUpModal } = useSignUpModal();
    const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const submitHandler = async (data: AuthSignUpType) => {
        try {
            setIsLoading(true);
            const signUpRequest = await signUp(data);
            if (signUpRequest.validated) {
                setValidated(signUpRequest.validated);
                if (signUpRequest.message) {
                    setMessage(signUpRequest.message);
                }
                if (signUpRequest.validated) {
                    reset();
                }
            }
            setIsLoading(false);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.log(error.message);
            }
        }
    };

    const signUpInstead = () => {
        showLogInModal();
        removeSignUpModal();
    };

    return (
        <section className={style.modalContainer}>
            <form className={style.form} onSubmit={handleSubmit(submitHandler)}>
                <FormInputField
                    id="signUp-id"
                    type="email"
                    labelText="Email"
                    object="email"
                    error={errors.email ? true : false}
                    errorMessage={errors.email && errors.email.message}
                    register={register}
                />
                <FormInputField
                    id="signUp-userName"
                    type="text"
                    labelText="User name"
                    object="userName"
                    error={errors.userName ? true : false}
                    errorMessage={errors.userName && errors.userName.message}
                    register={register}
                />
                <FormInputField
                    id="signUp-password"
                    type="password"
                    labelText="Password"
                    object="password"
                    error={errors.password ? true : false}
                    errorMessage={
                        !errors.password?.message?.includes("Password required")
                            ? "Invalid password"
                            : "Password required"
                    }
                    register={register}
                />
                <FormInputField
                    id="signUp-repeat-password"
                    type="password"
                    labelText="Repeat Password"
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
                    <SubmitMessage validated={validated} message={message} />
                )}
                {isLoading && (
                    <div className={style.loadingWrap}>
                        <LoadingCircle />
                    </div>
                )}
                <div className={style.btnWrap}>
                    <Button variant="black" text="Sign Up" />
                </div>
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
    );
}

export default SignUp;
