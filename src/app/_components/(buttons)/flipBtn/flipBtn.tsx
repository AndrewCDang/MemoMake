import React from "react";
import style from "./flipBtn.module.scss";
import { colours, coloursType } from "@/app/styles/colours";

export function FlipBtn({
    textWidth,
    baseText,
    baseCol,
    hoverCol,
    hoverText,
    handler,
    variant = "normal",
}: {
    textWidth?: string;
    baseText: string;
    baseCol?: coloursType;
    hoverCol?: coloursType;
    hoverText: string;
    handler?: () => void;
    variant?: "normal" | "large";
}) {
    const baseColour = baseCol
        ? { backgroundColor: colours[baseCol]() }
        : { opacity: 1 };
    const hoverColour = hoverCol
        ? { backgroundColor: colours[hoverCol]() }
        : { opacity: 1 };

    return (
        <button
            onClick={handler && handler}
            className={`${style.createAccountBtn} ${
                variant === "large" && style.largeBtn
            }`}
        >
            <span className={style.textWidth}>
                {textWidth ? textWidth : baseText}
            </span>
            <span style={baseColour} className={style.baseText}>
                {baseText}
            </span>
            <span style={hoverColour} className={style.hoverText}>
                {hoverText}
            </span>
        </button>
    );
}

export default FlipBtn;
