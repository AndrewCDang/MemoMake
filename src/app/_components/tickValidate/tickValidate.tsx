import { HiCheck } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import style from "./tickValidate.module.scss";

function TickValidate({ condition }: { condition: boolean }) {
    return (
        <>
            {condition ? (
                <div className={style.tickValidate}>
                    <HiCheck />
                </div>
            ) : (
                <div className={style.crossValidate}>
                    <HiMiniXMark />
                </div>
            )}
        </>
    );
}

export default TickValidate;
