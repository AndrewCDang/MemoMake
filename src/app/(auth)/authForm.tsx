"use client";
import React from "react";
import style from "./authForm.module.scss";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { useLogInModal } from "../_hooks/useLogIn";
import { useSignUpModal } from "../_hooks/useSignUp";
import { useForgotModal } from "../_hooks/useForgot";
import ForgotPassword from "./forgotPassword";

function AuthForm() {
    const { logInModal } = useLogInModal();
    const { signUpModal } = useSignUpModal();
    const { forgotModalisOpen } = useForgotModal();
    return (
        <section
            style={{
                zIndex:
                    logInModal || signUpModal || forgotModalisOpen ? 100 : -1,
                backgroundColor:
                    logInModal || signUpModal || forgotModalisOpen
                        ? "rgba(0,0,0,0.3)"
                        : "unset",
            }}
            className={style.authContainer}
        >
            <section>
                {logInModal && <LogIn />}
                {signUpModal && <SignUp />}
                {forgotModalisOpen && <ForgotPassword />}
            </section>
        </section>
    );
}

export default AuthForm;
