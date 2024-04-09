import React from "react";
import style from "./checkbox.module.scss";

type CheckBoxTypes = {
    id: string;
    handler: (id: string) => void;
};

function Checkbox({ id, handler }: CheckBoxTypes) {
    return (
        <div className={style.checkbox}>
            <input onChange={() => handler(id)} id={id} type="checkbox"></input>
            <label htmlFor={id}></label>
        </div>
    );
}

export default Checkbox;
