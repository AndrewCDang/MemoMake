"use client";
import React, { ReactNode } from "react";
import style from "./genericButton.module.scss";

type ButtonType = "button" | "hyperlink";

function GenericButton({
    type,
    children,
    handler,
}: {
    type?: ButtonType;
    children: ReactNode;
    handler?: () => void;
}) {
    if (type && type === "hyperlink") {
        return (
            <button
                onClick={() => handler && handler}
                className={style.hyperlinkButton}
            >
                {children}
            </button>
        );
    }
    return (
        <button
            onClick={() => handler && handler}
            className={style.genericButton}
        >
            {children}
        </button>
    );
}

export default GenericButton;
