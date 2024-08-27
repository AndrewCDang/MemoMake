import { ChangeEvent, KeyboardEvent, RefObject } from "react";
import style from "./inputField.module.scss";

type InputRef = {
    refObject?: RefObject<HTMLInputElement | HTMLTextAreaElement> | undefined;
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
    height?: "normal" | "short";
    enterHandler?: (value: string) => void;
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
    height = "normal",
    enterHandler,
}: InputRef) {
    const watchEnterHandler = (
        e: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        if (e.key === "Enter") {
            const target = e.target as HTMLTextAreaElement | HTMLInputElement;
            const value = target.value;
            enterHandler && enterHandler(value);
        }
    };

    return (
        <fieldset className={style.fieldset}>
            {textarea ? (
                <textarea
                    ref={refObject as RefObject<HTMLTextAreaElement>}
                    placeholder=""
                    id={id}
                    className={style.input}
                    value={inputValue || ""}
                    onChange={(e) => handler(e)}
                    onKeyDown={(e) => (
                        keyDownHandler && keyDownHandler(e),
                        enterHandler && watchEnterHandler(e)
                    )}
                ></textarea>
            ) : (
                <input
                    style={{
                        padding: height === "normal" ? "" : "0.5rem 0.5rem",
                    }}
                    ref={refObject as RefObject<HTMLInputElement>}
                    placeholder=""
                    id={id}
                    type={type}
                    value={inputValue}
                    className={style.input}
                    onChange={(e) => handler(e)}
                    onKeyDown={(e) => (
                        keyDownHandler && keyDownHandler(e),
                        enterHandler && watchEnterHandler(e)
                    )}
                ></input>
            )}
            <label
                style={{
                    color: error === true ? "rgb(255, 86, 120)" : "",
                }}
                htmlFor={id}
            >
                {placeholder && placeholder}
            </label>
        </fieldset>
    );
}

export default TextInput;
