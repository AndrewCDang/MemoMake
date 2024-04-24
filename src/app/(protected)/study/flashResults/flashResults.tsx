"use client";
import React, { useState } from "react";
import { CombinedType } from "../page";
import style from "./flashResults.module.scss";
import ExpandHeightToggler from "@/app/_components/expandHeightToggler/expandHeightToggler";
import MaxHeightToggler from "./maxHeightToggler";
import diffColour from "@/app/_components/difficultyColour/diffColour";
import { TbEdit } from "react-icons/tb";

type FlashResults = {
    flashCardItemsTest: CombinedType[];
};

function FlashResults({ flashCardItemsTest }: FlashResults) {
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
        <div className={style.resultsContainer}>
            {sortedArray.map((item) => {
                return (
                    <section className={style.resultContainer}>
                        <aside className={style.itemEdit}>
                            <TbEdit />
                        </aside>
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
                                <aside
                                    style={{
                                        backgroundColor: diffColour({
                                            diff: item.difficulty,
                                        }),
                                    }}
                                    className={style.difficultyIcon}
                                ></aside>
                                <div>
                                    <MaxHeightToggler
                                        isToggled={toggleOn[item.id]}
                                        isQuestion={true}
                                    >
                                        {item.item_question}
                                    </MaxHeightToggler>
                                    <MaxHeightToggler
                                        isToggled={toggleOn[item.id]}
                                        isQuestion={false}
                                    >
                                        {item.item_answer}
                                    </MaxHeightToggler>
                                </div>
                            </section>
                            <ExpandHeightToggler isOn={toggleOn[item.id]}>
                                <div className={style.toggledContainer}>
                                    {item.difficulty !== "NA" && (
                                        <div
                                            style={{
                                                color: diffColour({
                                                    diff: item.difficulty,
                                                }),
                                                borderColor: diffColour({
                                                    diff: item.difficulty,
                                                }),
                                                borderWidth: "1.5px",
                                                borderStyle: "solid",
                                            }}
                                            className={style.diffLabel}
                                        >
                                            {item.difficulty[0] +
                                                item.difficulty
                                                    .slice(1)
                                                    .toLocaleLowerCase()}
                                        </div>
                                    )}
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
        </div>
    );
}

export default FlashResults;
