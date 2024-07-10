import React, { RefObject } from "react";
import style from "./inputField.module.scss";

type InputRef<T extends string> = {
    ref?: RefObject<HTMLInputElement>;
    error?: boolean;
    id: T;
    object: T;
    type: string;
    errorMessage?: string | null;
    register: any;
    textarea?: boolean;
    defaultValue?: string;
};

function FormInputField<T extends string>({
    error,
    id,
    type,
    errorMessage = "Error",
    object,
    register,
    textarea,
    defaultValue = "",
}: InputRef<T>) {
    return (
        <fieldset className={style.fieldset}>
            {textarea ? (
                <textarea
                    placeholder=""
                    defaultValue={defaultValue}
                    id={id}
                    type={type}
                    className={style.input}
                    {...register(id)}
                ></textarea>
            ) : (
                <input
                    placeholder=""
                    defaultValue={defaultValue}
                    id={id}
                    type={type}
                    className={style.input}
                    {...register(object)}
                ></input>
            )}
            <label className={`${error ? style.error : ""}`} htmlFor={id}>
                {error ? id : id}
            </label>
        </fieldset>
    );
}

export default FormInputField;
