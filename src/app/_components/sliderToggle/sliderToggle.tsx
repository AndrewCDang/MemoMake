"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import style from "./sliderToggle.module.scss";

type SliderToggleTypes = {
    name: string;
    checked: boolean;
    setChecked?: Dispatch<SetStateAction<boolean>>;
    handler: () => void;
    variant?: "normal" | "coloured";
};

function SliderToggle({
    checked,
    name,
    handler,
    variant = "normal",
}: SliderToggleTypes) {
    return (
        <section
            className={`${style.sliderToggleContainer} ${
                variant === "coloured" && checked && style.colouredVariant
            }`}
        >
            <label htmlFor={name}></label>
            <input
                className={style.sliderInput}
                type="checkbox"
                id={name}
                checked={checked}
                onChange={() => handler()}
            ></input>
            <div className={style.sliderBall}></div>
        </section>
    );
}

export default SliderToggle;
