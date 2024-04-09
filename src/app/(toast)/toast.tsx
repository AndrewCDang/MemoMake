"use client";
import React from "react";
import style from "./toast.module.scss";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastNotify = (text: string) =>
    toast(text, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });

function Toast() {
    return (
        <aside className={style.toast}>
            <ToastContainer />
        </aside>
    );
}

export default Toast;
