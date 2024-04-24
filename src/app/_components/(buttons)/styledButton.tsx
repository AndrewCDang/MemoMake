"use client";
import React from "react";
import style from "./styledButtons.module.scss";
import { RightArrow } from "../svgs";

import { LoadingSpin } from "../svgs";

function Button({
    text,
    handler,
    loading,
    variant,
    disabled = false,
}: {
    text: string;
    handler?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    loading?: boolean;
    variant?: "black" | "white";
    disabled?: boolean;
}) {
    const loadingSpinAni = (
        <div style={{ stroke: "black", width: "100%" }}>
            <LoadingSpin />
        </div>
    );
    const loadingSpinHover = (
        <div style={{ stroke: "white", width: "100%" }}>
            <LoadingSpin />
        </div>
    );

    return (
        <button
            onClick={(e) => handler && handler(e)}
            className={`${style.button} ${disabled && style.disabled}`}
        >
            <div className={variant === "black" ? `${style.blackVarient}` : ""}>
                <h6>{text}</h6>
                <div>{loading ? loadingSpinAni : <RightArrow />}</div>
                <span>
                    <div>
                        <h6>{text}</h6>
                        <div>{loading ? loadingSpinHover : <RightArrow />}</div>
                    </div>
                </span>
            </div>
        </button>
    );
}

export default Button;
