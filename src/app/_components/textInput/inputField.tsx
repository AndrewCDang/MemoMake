import { ChangeEvent, RefObject } from "react";
import style from "./inputField.module.scss";

type InputRef = {
    refObject: RefObject<HTMLInputElement | HTMLTextAreaElement> | undefined;
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
    refObject = undefined,
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
                    ref={refObject as RefObject<HTMLTextAreaElement>}
                    placeholder=""
                    id={id}
                    className={style.input}
                    value={inputValue}
                    onChange={(e) => handler(e)}
                    onKeyDown={(e) => keyDownHandler && keyDownHandler(e)}
                ></textarea>
            ) : (
                <input
                    ref={refObject as RefObject<HTMLInputElement>}
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
