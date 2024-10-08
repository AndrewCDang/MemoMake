"use client";
import React, { RefObject, useEffect } from "react";
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
    labelText?: string;
    enterHandler?: () => void;
};

function FormInputField<T extends string>({
    error,
    id,
    labelText,
    type,
    errorMessage = "Error",
    object,
    register,
    textarea,
    defaultValue = "",
    enterHandler,
}: InputRef<T>) {
    const enterListener = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault(); // This works only in contexts where preventDefault() is applicable (e.g., forms)
            enterHandler && enterHandler();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", enterListener);

        // Cleanup to avoid memory leaks
        return () => {
            document.removeEventListener("keydown", enterListener);
        };
    }, []);
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
                {labelText ? labelText : id}
            </label>
        </fieldset>
    );
}

export default FormInputField;
