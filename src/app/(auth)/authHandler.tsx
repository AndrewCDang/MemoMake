"use client";
import React, { ReactNode } from "react";
import style from "./style.module.scss";

function AuthAccount({
    mode,
    children,
}: {
    mode: string;
    children: ReactNode;
}) {
    const signUpHandler = () => {
        alert("sign up");
    };

    const logInHandler = () => {
        alert("sign in");
    };

    if (mode === "signUp") {
        return (
            <div className={style.wrapper} onClick={signUpHandler}>
                {children}
            </div>
        );
    } else if (mode === "logIn") {
        return (
            <div className={style.wrapper} onClick={logInHandler}>
                {children}
            </div>
        );
    }
}

export default AuthAccount;
