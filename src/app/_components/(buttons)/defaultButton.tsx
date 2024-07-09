"use client";
import { MouseEvent, ReactNode } from "react";
import style from "./defaultButton.module.scss";

type DefaultButtonTypes = {
    children: ReactNode;
    variant?: "Black" | "White" | "red" | "yellow";
    handler?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
    border?: "thick" | "thin";
    outline?: boolean;
};

const DefaultButton = ({
    children,
    variant,
    handler,
    border = "thin",
    outline = true,
}: DefaultButtonTypes) => {
    return (
        <button
            style={{
                borderWidth: border === "thin" ? 0.5 : 1.5,
            }}
            onClick={(e) => handler && handler(e)}
            className={`${style.defaultButton} 
            ${outline === false ? style.noOutline : ""}
            ${
                variant === "Black"
                    ? style.defaultButtonBlack
                    : variant === "red"
                    ? style.defaultButtonRed
                    : variant === "yellow"
                    ? style.defaultButtonYellow
                    : ""
            }`}
        >
            {children}
        </button>
    );
};

export default DefaultButton;
