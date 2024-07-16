import { ReactNode } from "react";
import style from "./clipHoverBtn.module.scss";

const ClipHoverBtn = ({
    hoverChild,
    baseChild,
}: {
    hoverChild: ReactNode;
    baseChild: ReactNode;
}) => {
    return (
        <div className={style.clipBtnContainer}>
            <div className={style.hoverChild}>{hoverChild}</div>
            <div className={style.baseChild}>{baseChild}</div>
        </div>
    );
};

export default ClipHoverBtn;
