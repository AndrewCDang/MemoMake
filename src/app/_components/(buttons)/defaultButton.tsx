import { ReactNode } from "react";
import style from "./defaultButton.module.scss";

type DefaultButtonTypes = {
    children: ReactNode;
    variant?: "Black" | "White";
};

const DefaultButton = ({ children, variant }: DefaultButtonTypes) => {
    return (
        <button
            className={`${style.defaultButton} ${
                variant === "Black" && style.defaultButtonBlack
            }`}
        >
            {children}
        </button>
    );
};

export default DefaultButton;
