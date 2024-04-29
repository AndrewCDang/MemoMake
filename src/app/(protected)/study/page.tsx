"use client";
import React, { useEffect } from "react";
import useRevisionFlashItems from "@/app/_hooks/useRevisionFlashItems";
import InteractButtons from "./components/interactButtons/interactButtons";
import style from "./study.module.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue } from "framer-motion";
import FlashResults from "./flashResults/flashResults";
import ResultButtons from "./components/resultButtons/resultButtons";
import InteractiveCard from "./interactiveCard";
import { shuffleArray } from "@/app/_functions/shuffleArray";

const diffOptions = ["NA", "EASY", "MEDIUM", "HARD"];

type FlashCardItemsTest<T> = T & {
    correct: boolean | null;
    copy: boolean;
};

type TempType = {
    id: string;
    item_question: string;
    item_answer: string;
    difficulty: string;
    item_tags: string[];
};

export type CombinedType = FlashCardItemsTest<TempType>;

function page() {
    const { questions } = useRevisionFlashItems();

    const tags = [
        "maths",
        "english",
        "biology",
        "history",
        "geography",
        "physics",
        "chemistry",
        "art",
        "music",
        "literature",
        "philosophy",
        "economics",
        "sociology",
        "psychology",
        "computer_science",
        "medicine",
        "engineering",
        "law",
        "political_science",
        "anthropology",
    ];

    const genRandomNumbers = (amount: number): number[] => {
        if (amount < 1) amount = 1;
        const numSet = new Set<number>();
        while (numSet.size < amount) {
            const ranNum = Math.floor(Math.random() * tags.length);
            numSet.add(ranNum);
        }
        return Array.from(numSet);
    };

    const getRandomTags = () => {
        const arrayTags = genRandomNumbers(
            Number((Math.random() * 5).toFixed(0))
        ).map((item) => {
            return tags[item];
        });
        return arrayTags;
    };

    const testCards =
        questions.length > 0
            ? questions
            : [
                  {
                      id: "123",
                      item_question: "test1 q",
                      item_answer:
                          "test1 aa asdf asdfddfa dsf asdf asdf asf asdf asdf asdf asdf asdf asdf asdf asdf asdf asd f sfa fasdf afsdf sf",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "124",
                      item_question: "test2 q",
                      item_answer: "test2 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "125",
                      item_question: "test3 q",
                      item_answer: "test3 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "126",
                      item_question: "test4 q",
                      item_answer: "test4 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "127",
                      item_question: "test1 q",
                      item_answer: "test1 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "128",
                      item_question: "test2 q",
                      item_answer: "test2 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "129",
                      item_question: "test3 q",
                      item_answer: "test3 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
                  {
                      id: "130",
                      item_question: "test4 q",
                      item_answer: "test4 a",
                      difficulty:
                          diffOptions[Number((Math.random() * 3).toFixed(0))],
                      item_tags: getRandomTags(),
                  },
              ];

    const initialTestCards = testCards.map((item) => {
        return { ...item, correct: null, copy: false };
    }) as CombinedType[];

    // States for flashcard position and content
    const [testIncorrect, setTestIncorrect] = useState<boolean>(false);
    const [incorrectQuestions, setIncorrectQuestions] =
        useState<CombinedType[]>();

    const [currentCard, setCurrentCard] = useState<number>(0);
    const [flashCardItemsTest, setFlashCardItemsTest] = useState<
        CombinedType[]
    >([...initialTestCards]);

    useEffect(() => {
        setFlashCardItemsTest(shuffleArray<CombinedType>(initialTestCards));
    }, []);

    // States for FlashCard transformations
    const [isFlipped, setIsFlipped] = useState<boolean>(false);
    const [topLighting, setTopLighting] = useState<boolean>(false);
    const xSet = useMotionValue(0);

    const flipCard = () => {
        setIsFlipped((prevState) => {
            if (prevState === false) {
                xSet.set(180);
            } else {
                xSet.set(0);
            }
            return !prevState;
        });
    };

    const answerHandler = ({ correct }: { correct: boolean }) => {
        if (testIncorrect && incorrectQuestions !== undefined) {
            setIncorrectQuestions((prevState) => {
                return (prevState as CombinedType[]).map((item, index) => {
                    if (index === currentCard) {
                        return { ...item, correct: correct };
                    }
                    return item;
                });
            });
        } else if (!testIncorrect) {
            setFlashCardItemsTest((prevState) => {
                return prevState.map((item, index) => {
                    if (index === currentCard) {
                        return { ...item, correct: correct };
                    }
                    return item;
                });
            });
        }

        setTimeout(() => {
            if (isFlipped) {
                setIsFlipped(false);
                xSet.set(0);
            }

            setTimeout(() => {
                setTopLighting(true);
                setCurrentCard((prevState) => {
                    return prevState + 1;
                });
            }, 0);
        }, 0);
    };

    // Prepared Questions

    const chosenQuestions =
        testIncorrect && incorrectQuestions
            ? incorrectQuestions
            : flashCardItemsTest;

    useEffect(() => {
        console.log(chosenQuestions);
    }, [chosenQuestions]);

    return (
        <section className={style.studyContainer}>
            <section className={style.studyTitle}>
                {currentCard < chosenQuestions.length ? (
                    <h6>Study Cards</h6>
                ) : (
                    <h6>Study Results</h6>
                )}
                <div className={style.setLabelContainer}>
                    <div>set1</div>
                    <div>set2</div>
                    <div>set3</div>
                </div>
            </section>
            <AnimatePresence>
                {currentCard < chosenQuestions.length ? (
                    <InteractiveCard
                        flashCardItemsTest={chosenQuestions}
                        currentCard={currentCard}
                        xSet={xSet}
                        isFlipped={isFlipped}
                        answerHandler={answerHandler}
                        flipCard={flipCard}
                        topLighting={topLighting}
                        setTopLighting={setTopLighting}
                    />
                ) : (
                    // Displays Results when all questions have been answered
                    <FlashResults
                        flashCardItemsTest={chosenQuestions}
                        testIncorrect={testIncorrect}
                        setTestIncorrect={setTestIncorrect}
                        setIncorrectQuestions={setIncorrectQuestions}
                    />
                )}
            </AnimatePresence>
            {/* Interactive Buttons at bottom */}
            <section className={style.interationButtonsContainer}>
                <div>
                    <AnimatePresence>
                        {currentCard < chosenQuestions.length ? (
                            <motion.div
                                layout="position"
                                key="test"
                                initial={{ opacity: 0, y: 200 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 200 }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                }}
                            >
                                {/* Card Label - Stating current card out of all cards in test */}
                                {currentCard < chosenQuestions.length && (
                                    <motion.section
                                        className={style.cardCaption}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <p>Card {currentCard + 1}</p>
                                        <p>out of {chosenQuestions.length}</p>
                                    </motion.section>
                                )}
                                <InteractButtons
                                    setIsFlipped={setIsFlipped}
                                    flipCard={flipCard}
                                    answerHandler={answerHandler}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                layout="position"
                                key="result"
                                initial={{ opacity: 0, y: 200 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 200 }}
                                transition={{
                                    type: "spring",
                                    damping: 15,
                                }}
                            >
                                <ResultButtons
                                    flashCardItems={chosenQuestions}
                                    setCurrentCard={setCurrentCard}
                                    testIncorrect={testIncorrect}
                                    setTestIncorrect={setTestIncorrect}
                                    setIncorrectQuestions={
                                        setIncorrectQuestions
                                    }
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>
        </section>
    );
}

export default page;
