import React from "react";
import style from "./radioSelect.module.scss";

type RadioTypes = {
    options: string[];
    handler: (arg: string) => void;
};

function RadioSelect({ options, handler }: RadioTypes) {
    return (
        <div className={style.radioContainer}>
            <label>Difficulty</label>
            <div className={style.radioSelect}>
                {options.map((option, index) => {
                    return (
                        <fieldset key={index}>
                            <input
                                defaultChecked={index === 0}
                                name="radio-difficulty"
                                id={`radio-${option}`}
                                type="radio"
                                onChange={() => handler(option)}
                            ></input>
                            <label
                                className={`
                            ${index === 0 && style.na}
                            ${index === 1 && style.easy}
                            ${index === 2 && style.medium}
                            ${index === 3 && style.hard}
                            `}
                                htmlFor={`radio-${option}`}
                            >
                                {option}
                            </label>
                        </fieldset>
                    );
                })}
            </div>
        </div>
    );
}

export default RadioSelect;
