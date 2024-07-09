import { ChangeEvent, Dispatch, RefObject, SetStateAction } from "react";
import style from "./inputField.module.scss";

type InputRef = {
    error?: boolean;
    id: string;
    placeholder: string;
    errorMessage?: string | null;
    type: "text" | "textarea";
    handler: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    input: string | undefined;
    setInput: Dispatch<SetStateAction<string | undefined>>;
};

function TextInput({
    error,
    id,
    type,
    placeholder,
    input,
    setInput,
}: InputRef) {
    const handler = (
        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
        setInput(e.target.value);
    };
    return (
        <fieldset className={style.fieldset}>
            {type === "textarea" ? (
                <textarea
                    placeholder=""
                    id={id}
                    className={style.input}
                    value={input}
                    onChange={(e) => handler(e)}
                ></textarea>
            ) : (
                <input
                    placeholder=""
                    id={id}
                    type={"text"}
                    value={input}
                    className={style.input}
                    onChange={(e) => handler(e)}
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
