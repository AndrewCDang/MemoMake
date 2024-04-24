import React, { Dispatch, SetStateAction } from "react";
import style from "./sliderToggle.module.scss";

type SliderToggleTypes = {
    name: string;
    checked: boolean;
    setChecked: Dispatch<SetStateAction<boolean>>;
    handler: () => void;
};

function SliderToggle({
    name,
    checked,
    setChecked,
    handler,
}: SliderToggleTypes) {
    return (
        <section className={style.sliderToggleContainer}>
            <label htmlFor={name}></label>
            <input
                className={style.sliderInput}
                type="checkbox"
                id={name}
                onChange={() => handler()}
            ></input>
            <div className={style.sliderBall}></div>
        </section>
    );
}

export default SliderToggle;
