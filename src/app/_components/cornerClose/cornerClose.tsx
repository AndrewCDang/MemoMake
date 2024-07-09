import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import style from "./close.module.scss";

type CloseHandler = {
    handler: () => void;
    cornerSpace?: "normal" | "tight";
    type?: "withinCorner" | "circleCorner" | "relative";
};

function CornerClose({
    handler,
    cornerSpace,
    type = "withinCorner",
}: CloseHandler) {
    const cornerSpacing =
        cornerSpace === "tight"
            ? { top: "0.1rem", right: "0.1rem" }
            : { top: "0.5rem", right: "0.5rem" };
    return (
        <>
            {type === "withinCorner" && (
                <button
                    onClick={handler}
                    style={cornerSpacing}
                    className={style.close}
                >
                    <HiMiniXMark />
                </button>
            )}
            {type === "circleCorner" && (
                <button onClick={handler} className={style.closeCircleCorner}>
                    <HiMiniXMark />
                </button>
            )}
            {type === "relative" && (
                <button onClick={handler} className={style.closeRelative}>
                    <HiMiniXMark />
                </button>
            )}
        </>
    );
}

export default CornerClose;
