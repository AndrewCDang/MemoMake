"use client";

import React, { startTransition, useState, ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import style from "./authForm.module.scss";
import FormInputField from "../_components/input/formInputField";
import { AuthAccountType, AuthSchema } from "../../schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/(buttons)/styledButton";
import GenericButton from "../_components/(buttons)/genericButtton";
import { logIn } from "../_actions/login";
import SubmitMessage from "./_components/submitResults/submitMessage";
import signInGoogle from "./signInGoogle";
import { useLogInModal } from "../_hooks/useLogIn";
import { useForgotModal } from "../_hooks/useForgot";
import { useSignUpModal } from "../_hooks/useSignUp";

function LogIn() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AuthAccountType>({
        resolver: zodResolver(AuthSchema),
        mode: "onChange",
    });

    const { removeLogInModal } = useLogInModal();
    const { showForgotModal } = useForgotModal();
    const { showSignUpModal } = useSignUpModal();

    const [validated, setValidated] = useState<boolean | undefined>(undefined);
    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const forgotHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        removeLogInModal();
        showForgotModal();
    };

    const ForgotBtn = ({ children }: { children: ReactNode }) => {
        return (
            <button
                onClick={(e) => {
                    forgotHandler(e);
                }}
            >
                {children}
            </button>
        );
    };

    const submitHandler = (data: AuthAccountType) => {
        startTransition(() => {
            logIn(data).then((data) => {
                setValidated(data?.validated);
                if (data?.message) {
                    setErrorMessage(data.message);
                }
            });
        });
        reset();
    };

    const signUpInstead = () => {
        removeLogInModal();
        showSignUpModal();
    };

    return (
        <section>
            <form className={style.form} onSubmit={handleSubmit(submitHandler)}>
                <FormInputField
                    id="logIn-id"
                    type="email"
                    labelText="Email"
                    object="email"
                    error={errors.email ? true : false}
                    errorMessage={errors.email && errors.email.message}
                    register={register}
                />
                <FormInputField
                    id="logIn-password"
                    type="password"
                    labelText="Password"
                    object="password"
                    error={errors.password ? true : false}
                    errorMessage={errors.password && errors.password.message}
                    register={register}
                />
                {validated != undefined && (
                    <SubmitMessage
                        validated={validated}
                        message={errorMessage}
                    />
                )}
                <ForgotBtn>
                    <GenericButton type={"hyperlink"}>
                        <span>Forgot password</span>
                    </GenericButton>
                </ForgotBtn>
                <div className={style.centerBtn}>
                    <Button text="Log In" variant="black" />
                </div>
            </form>
            <div className={style.authBorder}>
                <p>or</p>
            </div>
            <aside onClick={() => signInGoogle()}>
                <GenericButton type={"button"}>
                    <div className={style.authBtn}>
                        <FcGoogle />
                        <label>Continue with Google</label>
                    </div>
                </GenericButton>
            </aside>
            <div className={style.authOther}>
                <p onClick={signUpInstead}>
                    Don&apos;t have an account? <strong>Sign up</strong> here
                </p>
            </div>
        </section>
    );
}

export default LogIn;
