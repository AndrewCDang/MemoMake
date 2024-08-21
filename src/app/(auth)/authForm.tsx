"use client";
import React from "react";
import style from "./authForm.module.scss";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import { useLogInModal } from "../_hooks/useLogIn";
import { useSignUpModal } from "../_hooks/useSignUp";
import { useForgotModal } from "../_hooks/useForgot";
import ForgotPassword from "./forgotPassword";
import Modal from "../_components/modal/modal";

function AuthForm() {
    const { logInModal, removeLogInModal } = useLogInModal();
    const { signUpModal, removeSignUpModal } = useSignUpModal();
    const { forgotModalisOpen, closeForgotModal } = useForgotModal();
    return (
        <>
            <Modal
                modalOn={logInModal}
                modalTitle="Log In"
                setModal={removeLogInModal}
            >
                <LogIn />
            </Modal>
            <Modal
                modalOn={signUpModal}
                modalTitle="Sign Up"
                setModal={removeSignUpModal}
            >
                <SignUp />
            </Modal>
            <Modal
                modalOn={forgotModalisOpen}
                modalTitle="Reset Password"
                setModal={closeForgotModal}
            >
                <ForgotPassword />
            </Modal>
        </>
    );
}

export default AuthForm;
