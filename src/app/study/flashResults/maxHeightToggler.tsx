import { HiOutlineCheckCircle } from "react-icons/hi2";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

import style from "./flashResults.module.scss";
import React, { ReactNode } from "react";

function MaxHeightToggler({
    children,
    isToggled,
    isQuestion,
}: {
    children: ReactNode;
    isToggled: boolean;
    isQuestion: boolean;
}) {
    return (
        <section
            style={{
                display: "grid",
                gridTemplateRows: isToggled ? "1fr" : "0fr",
                transition: "all 0.3s ease-in-out",
                minHeight: isToggled ? "2rem" : "0rem",
            }}
            className={style.textTogglerContainer}
        >
            <div
                style={{
                    overflow: "hidden",
                    minHeight: "2.5rem",
                    textWrap: isToggled ? "unset" : "nowrap",
                }}
                className={style.resultQuestion}
            >
                {children}
            </div>
            <div className={style.cardIcon}>
                {isQuestion ? (
                    <HiOutlineQuestionMarkCircle />
                ) : (
                    <HiOutlineCheckCircle />
                )}
            </div>
        </section>
    );
}

export default MaxHeightToggler;
