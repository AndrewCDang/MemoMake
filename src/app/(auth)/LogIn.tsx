"use client";

import React, { startTransition, useState, useRef, ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";
import style from "./authForm.module.scss";
import InputField from "../_components/input/inputField";
import { AuthAccountType, AuthSchema } from "../../schema/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../_components/(buttons)/styledButton";
import GenericButton from "../_components/(buttons)/genericButtton";
import CloseButton from "../_components/(buttons)/closeButton";
import CloseLogInModal from "./_hooks/closeLogInModal";
import { logIn } from "../_actions/login";
import SubmitMessage from "./_components/submitResults/submitMessage";
import signInGoogle from "./signInGoogle";
import { useLogInModal } from "../_hooks/useLogIn";
import { useForgotModal } from "../_hooks/useForgot";
import { useSignUpModal } from "../_hooks/useSignUp";

function LogIn() {
    const {
        getValues,
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setError,
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
        <section className={style.formContainer}>
            <section>
                <div className={style.authTop}>
                    <h4>Log in</h4>
                    <CloseLogInModal>
                        <CloseButton />
                    </CloseLogInModal>
                </div>
                <form
                    className={style.form}
                    onSubmit={handleSubmit(submitHandler)}
                >
                    <InputField
                        id="logIn-id"
                        type="email"
                        placeholder="Email"
                        object="email"
                        error={errors.email ? true : false}
                        errorMessage={errors.email && errors.email.message}
                        register={register}
                    />
                    <InputField
                        id="logIn-password"
                        type="password"
                        placeholder="Password"
                        object="password"
                        error={errors.password ? true : false}
                        errorMessage={
                            errors.password && errors.password.message
                        }
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
                        Don't have an account? <strong>Sign up</strong> here
                    </p>
                </div>
            </section>
        </section>
    );
}

export default LogIn;
