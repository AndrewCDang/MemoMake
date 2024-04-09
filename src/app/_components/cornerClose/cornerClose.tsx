import React from "react";
import { HiMiniXMark } from "react-icons/hi2";
import style from "./close.module.scss";

type CloseHandler = {
    handler: () => void;
};

function CornerClose({ handler }: CloseHandler) {
    return (
        <button onClick={handler} className={style.close}>
            <HiMiniXMark />
        </button>
    );
}

export default CornerClose;
