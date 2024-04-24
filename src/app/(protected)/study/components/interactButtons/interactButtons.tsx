import React, { Dispatch, SetStateAction } from "react";
import style from "./interactButtons.module.scss";
import { HiCheck } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";

type InteractButtonsTypes = {
    answerHandler: ({ correct }: { correct: boolean }) => void;
    setIsFlipped: Dispatch<SetStateAction<boolean>>;
    flipCard: () => void;
};

function InteractButtons({
    answerHandler,
    setIsFlipped,
    flipCard,
}: InteractButtonsTypes) {
    return (
        <section className={style.btnInterationContainer}>
            <div className={style.btnDecisionContainer}>
                <button
                    onClick={() => answerHandler({ correct: false })}
                    className={style.btnIncorrect}
                >
                    <HiMiniXMark />
                </button>
                <div
                    onClick={() => flipCard()}
                    className={style.flipBtnContainer}
                >
                    <div className={style.flipBtn}>
                        <div className={style.frontFace}>
                            <span>Flip Card </span>
                            <HiMiniArrowPathRoundedSquare />
                        </div>
                        <div className={style.backFace}>
                            <span>Flip Card </span>
                            <HiMiniArrowPathRoundedSquare />
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => answerHandler({ correct: true })}
                    className={style.btnCorrect}
                >
                    <HiCheck />
                </button>
            </div>
        </section>
    );
}

export default InteractButtons;
