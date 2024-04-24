import { ChangeEvent, RefObject } from "react";
import style from "./inputField.module.scss";

type InputRef = {
    error?: boolean;
    id: string;
    placeholder: string;
    type: string;
    errorMessage?: string | null;
    textarea?: boolean;
    handler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    keyDownHandler?: (
        e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    inputValue: string;
};

function TextInput({
    error,
    id,
    type,
    textarea,
    placeholder,
    handler,
    keyDownHandler,
    inputValue,
}: InputRef) {
    return (
        <fieldset className={style.fieldset}>
            {textarea ? (
                <textarea
                    placeholder=""
                    id={id}
                    className={style.input}
                    value={inputValue}
                    onChange={(e) => handler(e)}
                    onKeyDown={(e) => keyDownHandler && keyDownHandler(e)}
                ></textarea>
            ) : (
                <input
                    placeholder=""
                    id={id}
                    type={type}
                    value={inputValue}
                    className={style.input}
                    onChange={(e) => handler(e)}
                    onKeyDown={(e) => keyDownHandler && keyDownHandler(e)}
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
                {placeholder && placeholder}
            </label>
        </fieldset>
    );
}

export default TextInput;
