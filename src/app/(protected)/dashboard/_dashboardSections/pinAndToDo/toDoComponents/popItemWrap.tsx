import { Dispatch, ReactNode, SetStateAction } from "react";
import style from "../pinAndToDo.module.scss";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";

function PopItemWrap({
    children,
    focused,
    setFocus,
}: {
    children: ReactNode;
    focused: boolean;
    setFocus: Dispatch<SetStateAction<any>>;
}) {
    return (
        <div
            style={{
                zIndex: 1,
                pointerEvents: focused ? "all" : "none",
            }}
            className={style.popWrap}
        >
            <PopOverContent isOn={focused} setIsOn={setFocus}>
                {children}
            </PopOverContent>
        </div>
    );
}

export default PopItemWrap;
