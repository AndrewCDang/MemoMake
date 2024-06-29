import React, { Dispatch, ReactNode, SetStateAction } from "react";
import style from "./resultButtons.module.scss";
import ResultsGraph from "./components/resultsGraph";
import { HiMiniArrowLeftOnRectangle } from "react-icons/hi2";
import { HiOutlineXCircle } from "react-icons/hi2";
import { HiOutlineArrowPath } from "react-icons/hi2";
import { CombinedType } from "../../study";
import Link from "next/link";

function ResultButtons({
    flashCardItems,
    setCurrentCard,
    testIncorrect,
    setTestIncorrect,
    setIncorrectQuestions,
}: {
    flashCardItems: CombinedType[];
    setCurrentCard: Dispatch<SetStateAction<number>>;
    testIncorrect: boolean;
    setTestIncorrect: Dispatch<SetStateAction<boolean>>;
    setIncorrectQuestions: Dispatch<SetStateAction<CombinedType[] | undefined>>;
}) {
    const correctItems = flashCardItems.filter((item) => item.correct);
    const percentCorrect = (correctItems.length / flashCardItems.length) * 100;

    type ResultButtonTypes = {
        children: ReactNode;
        variant?: "Black" | "White";
        handler?: () => void;
    };

    const ResultButton = ({
        children,
        variant,
        handler,
    }: ResultButtonTypes) => {
        return (
            <button
                onClick={() => handler && handler()}
                className={`${style.resultButton} ${
                    variant === "Black" && style.resultButtonBlack
                }`}
            >
                {children}
            </button>
        );
    };

    const updateIncorrectQuestions = () => {
        const incorrectQuestions = flashCardItems.filter(
            (item) => !item.correct
        );
        setIncorrectQuestions(incorrectQuestions);
    };

    const incorrectTestModeHandler = () => {
        updateIncorrectQuestions();
        setTestIncorrect(true);
        setCurrentCard(0);
    };

    const testAgainHandler = () => {
        if (testIncorrect) {
            setTestIncorrect(false);
        }
        setCurrentCard(0);
    };

    return (
        <section className={style.resultButtonsContainer}>
            <div className={style.resultGraphContainer}>
                <ResultsGraph progress={percentCorrect} />
            </div>
            <section className={style.buttonsContainer}>
                <Link href={"/dashboard"}>
                    <ResultButton variant="Black">
                        <>
                            <div>Dashboard</div>
                            <HiMiniArrowLeftOnRectangle />
                        </>
                    </ResultButton>
                </Link>
                <div className={style.buttonContainer}>
                    {flashCardItems.length - correctItems.length > 0 && (
                        <ResultButton
                            handler={() => incorrectTestModeHandler()}
                        >
                            <>
                                <div>
                                    <div>Test Incorrect Only</div>
                                    <span className={style.incorrectLabel}>
                                        {flashCardItems.length -
                                            correctItems.length}{" "}
                                        item
                                        {flashCardItems.length -
                                            correctItems.length >
                                            1 && "s"}{" "}
                                        incorrect
                                    </span>
                                </div>
                                <HiOutlineXCircle />
                            </>
                        </ResultButton>
                    )}
                    <ResultButton handler={() => testAgainHandler()}>
                        <>
                            <div>
                                {testIncorrect
                                    ? "Test Original Again"
                                    : "Test Again"}
                            </div>
                            <HiOutlineArrowPath />
                        </>
                    </ResultButton>
                </div>
            </section>
        </section>
    );
}

export default ResultButtons;
