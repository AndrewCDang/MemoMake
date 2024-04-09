import React, { RefObject } from "react";
import style from "./inputField.module.scss";

type InputRef = {
    ref?: RefObject<HTMLInputElement>;
    error?: boolean;
    id: string;
    type: string;
    placeholder: string;
    errorMessage?: string | null;
    object: string;
    register: any;
    textarea?: boolean;
};

function InputField({
    error,
    id,
    type,
    errorMessage = "Error",
    placeholder,
    object,
    register,
    textarea,
}: InputRef) {
    return (
        <fieldset className={style.fieldset}>
            {textarea ? (
                <textarea
                    placeholder=""
                    id={id}
                    type={type}
                    className={style.input}
                    {...register(object)}
                ></textarea>
            ) : (
                <input
                    placeholder=""
                    id={id}
                    type={type}
                    className={style.input}
                    {...register(object)}
                ></input>
            )}
            <label
                style={{
                    color:
                        error == true
                            ? "rgb(255, 86, 120)"
                            : "rgb(169, 169, 169)",
                }}
                htmlFor={id}
            >
                {error ? errorMessage : placeholder}
            </label>
        </fieldset>
    );
}

export default InputField;
