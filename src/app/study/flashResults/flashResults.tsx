"use client";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { CombinedType } from "../study";
import style from "./flashResults.module.scss";
import ExpandHeightToggler from "@/app/_components/expandHeightToggler/expandHeightToggler";
import MaxHeightToggler from "./maxHeightToggler";
import diffColour from "@/app/_components/difficultyColour/diffColour";
import { TbEdit } from "react-icons/tb";
import { HiCheck } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import { HiArrowRight } from "react-icons/hi2";
import { motion } from "framer-motion";
import { labelColour } from "@/app/_components/_generalUi/difficultyColours/difficultyColours";
import DifficultyBtns from "./components/difficultyBtns";
import {
    Flashcard_collection_with_cards,
    Flashcard_set_with_cards,
} from "@/app/_types/types";

type FlashResults = {
    data: Flashcard_collection_with_cards[] | Flashcard_set_with_cards[];
    flashCardItemsTest: CombinedType[];
    testIncorrect: boolean;
    setTestIncorrect: Dispatch<SetStateAction<boolean>>;
    userId: string | undefined;
};

function FlashResults({
    data,
    flashCardItemsTest,
    testIncorrect,
    userId,
}: FlashResults) {
    let emptyObject = {};
    flashCardItemsTest.forEach((item) => {
        emptyObject = { ...emptyObject, [item.id]: false };
    });

    type ToggleObjects = {
        [obj: string]: boolean;
    };
    const [toggleOn, setToggleOn] = useState<ToggleObjects>(emptyObject);

    const sortByCorrect = (array: CombinedType[]) => {
        const sortedArray = array.sort((a, b) => {
            if (!a.correct && b.correct) {
                return -1;
            } else if (a.correct && !b.correct) {
                return 1;
            }
            return 0;
        });
        return sortedArray;
    };

    const sortByDiff = (array: CombinedType[]) => {
        const sortedArray = array.sort((a, b) => {
            const diffScore = (item: string) => {
                switch (item) {
                    case "NA":
                        return 0;
                    case "EASY":
                        return 1;
                    case "MEDIUM":
                        return 2;
                    case "HARD":
                        return 3;
                    default:
                        return 0;
                }
            };
            if (diffScore(a.difficulty) >= diffScore(b.difficulty)) {
                return 1;
            } else {
                return -1;
            }
        });
        return sortedArray;
    };

    const sortedArray = sortByCorrect(sortByDiff(flashCardItemsTest));
    return (
        <motion.section
            className={style.resultsContainer}
            key={"ResultsContainer"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {sortedArray.map((item) => {
                return (
                    <section key={item.id} className={style.resultContainer}>
                        <section
                            onClick={() =>
                                setToggleOn((prevState) => {
                                    return {
                                        ...prevState,
                                        [item.id]: !prevState[item.id],
                                    };
                                })
                            }
                            key={item.id}
                            className={`${style.resultItem} ${style.resultsBanner}`}
                        >
                            <section className={style.resultsCompact}>
                                <aside className={style.resultInfo}>
                                    {item.correct ? (
                                        <div className={style.correctSVG}>
                                            {<HiCheck />}
                                        </div>
                                    ) : (
                                        <div className={style.incorrectSVG}>
                                            <HiMiniXMark />
                                        </div>
                                    )}
                                    {
                                        <DifficultyBtns
                                            data={data}
                                            item={item}
                                            userId={userId}
                                        />
                                    }
                                </aside>
                                <div>
                                    <MaxHeightToggler
                                        isToggled={toggleOn[item.id]}
                                        isQuestion={true}
                                    >
                                        <div
                                            className={
                                                style.questionAnswerContainer
                                            }
                                        >
                                            {item.question_img && (
                                                <motion.div
                                                    animate={{
                                                        height: toggleOn[
                                                            item.id
                                                        ]
                                                            ? "4rem"
                                                            : "1.5rem",
                                                        width: toggleOn[item.id]
                                                            ? "4rem"
                                                            : "1.5rem",
                                                    }}
                                                    transition={{
                                                        stiffness: 150,
                                                        damping: 15,
                                                        mass: 0.1,
                                                    }}
                                                    className={
                                                        style.imageContainer
                                                    }
                                                >
                                                    <img
                                                        src={item.question_img}
                                                    ></img>
                                                </motion.div>
                                            )}
                                            {item.item_question}
                                        </div>
                                    </MaxHeightToggler>
                                    <div className={style.arrow}>
                                        <HiArrowRight />
                                    </div>
                                    <MaxHeightToggler
                                        isToggled={toggleOn[item.id]}
                                        isQuestion={false}
                                    >
                                        <div
                                            className={
                                                style.questionAnswerContainer
                                            }
                                        >
                                            {item.answer_img && (
                                                <motion.div
                                                    animate={{
                                                        height: toggleOn[
                                                            item.id
                                                        ]
                                                            ? "4rem"
                                                            : "1.5rem",
                                                        width: toggleOn[item.id]
                                                            ? "4rem"
                                                            : "1.5rem",
                                                    }}
                                                    transition={{
                                                        stiffness: 150,
                                                        damping: 15,
                                                        mass: 0.1,
                                                    }}
                                                    className={
                                                        style.imageContainer
                                                    }
                                                >
                                                    <img
                                                        src={item.answer_img}
                                                    ></img>
                                                </motion.div>
                                            )}
                                            <span>{item.item_answer}</span>
                                        </div>
                                    </MaxHeightToggler>
                                </div>
                            </section>
                            <ExpandHeightToggler isOn={toggleOn[item.id]}>
                                <div className={style.toggledContainer}>
                                    <div className={style.tagContainer}>
                                        {item.item_tags &&
                                            item.item_tags.map((tag, index) => {
                                                return (
                                                    <div
                                                        key={`${tag}-${index}`}
                                                        className={
                                                            style.tagLabel
                                                        }
                                                    >
                                                        {tag}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>
                            </ExpandHeightToggler>

                            <div
                                className={`${
                                    item.correct
                                        ? style.resultCorrect
                                        : style.resultIncorrect
                                }`}
                            ></div>
                        </section>
                    </section>
                );
            })}
        </motion.section>
    );
}

export default FlashResults;
