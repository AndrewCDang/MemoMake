import React, { ReactNode } from "react";
import style from "./genericButton.module.scss";

type ButtonType = "button" | "hyperlink";

function GenericButton({
    type,
    children,
}: {
    type: ButtonType;
    children: ReactNode;
}) {
    if (type === "hyperlink") {
        return <button className={style.hyperlinkButton}>{children}</button>;
    }
    return <button className={style.genericButton}>{children}</button>;
}

export default GenericButton;
