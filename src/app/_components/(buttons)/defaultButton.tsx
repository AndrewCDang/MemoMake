"use client";
import { ReactNode } from "react";
import style from "./defaultButton.module.scss";

type DefaultButtonTypes = {
    children: ReactNode;
    variant?: "Black" | "White";
    handler?: () => void;
};

const DefaultButton = ({ children, variant, handler }: DefaultButtonTypes) => {
    return (
        <button
            onClick={() => handler && handler}
            className={`${style.defaultButton} ${
                variant === "Black" && style.defaultButtonBlack
            }`}
        >
            {children}
        </button>
    );
};

export default DefaultButton;
