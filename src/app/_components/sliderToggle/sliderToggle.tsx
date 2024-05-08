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
    name,
    checked,
    setChecked,
    handler,
    variant = "normal",
}: SliderToggleTypes) {
    const [isChecked, setIsChecked] = useState(checked);

    return (
        <section
            className={`${style.sliderToggleContainer} ${
                variant === "coloured" && isChecked && style.colouredVariant
            }`}
        >
            <label htmlFor={name}></label>
            <input
                className={style.sliderInput}
                type="checkbox"
                id={name}
                checked={isChecked}
                onChange={() => (
                    handler(),
                    setIsChecked((prevState) => {
                        return !prevState;
                    })
                )}
            ></input>
            <div className={style.sliderBall}></div>
        </section>
    );
}

export default SliderToggle;
