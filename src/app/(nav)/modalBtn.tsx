"use client";

import React from "react";
import style from "./nav.module.scss";
import { useLogInModal } from "../_hooks/useLogIn";
import { useSignUpModal } from "../_hooks/useSignUp";

function ModalBtn() {
    const { showLogInModal } = useLogInModal();
    const { showSignUpModal } = useSignUpModal();
    return (
        <>
            <button onClick={showSignUpModal}>Sign Up</button>
            <button onClick={showLogInModal}>Log In</button>
        </>
    );
}

export default ModalBtn;
