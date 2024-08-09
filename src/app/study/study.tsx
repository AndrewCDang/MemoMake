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
import { ContentType, Difficulty, Flashcard_item } from "../_types/types";
import { updateUserHistory } from "./components/userHistory/userHistory";
import { fetchFlashCards } from "./functions/fetchFlashCards";

type FlashCardItemsTest<T> = T & {
    correct: boolean | null;
    copy: boolean;
};

export type CombinedType = FlashCardItemsTest<Flashcard_item>;

type StudyTypes = {
    ids: string[];
    contentType: ContentType;
    tags: string[] | undefined;
    difficulties: Difficulty[] | undefined;
    userId: string | undefined;
};

function Study({ ids, contentType, tags, difficulties, userId }: StudyTypes) {
    const { collectionItems, questions } = useRevisionFlashItems();
    // States for titles/subtitles
    const [titles, setTitles] = useState<string[]>(
        collectionItems.map((item) => item.collection_name)
    );
    const [subTitles, setSubTitles] = useState<string[]>(
        collectionItems.flatMap((item) =>
            item.sets.map((item) => item.set_name)
        )
    );

    // States for flashcard position and content
    const [currentCard, setCurrentCard] = useState<number>(0);
    const [testIncorrect, setTestIncorrect] = useState<boolean>(false);
    const [incorrectQuestions, setIncorrectQuestions] =
        useState<CombinedType[]>();

    const initialTestCards = (flashcardItems: Flashcard_item[]) =>
        flashcardItems.length > 0
            ? (flashcardItems.map((item) => {
                  return { ...item, correct: null, copy: false };
              }) as CombinedType[])
            : [];
    const [flashCardItemsTest, setFlashCardItemsTest] = useState<
        CombinedType[]
    >([...initialTestCards(questions)]);

    useEffect(() => {
        if (questions.length === 0) {
            fetchFlashCards({
                ids: ids,
                contentType: contentType,
                tags: tags,
                difficulties: difficulties,
                setSubTitles: setSubTitles,
                setFlashCardItemsTest: setFlashCardItemsTest,
                setTitles: setTitles,
            });
        }
    }, [questions]);

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

    const userHistory = async () => {
        if (userId) {
            const correctCount = flashCardItemsTest.reduce((acc, curr) => {
                if (curr.correct) {
                    return acc + 1;
                } else {
                    return acc;
                }
            }, 0);

            const correctPercent = Number(
                ((correctCount / flashCardItemsTest.length) * 100).toFixed(2)
            );

            const newItem = {
                ids: ids,
                tags: tags,
                difficulties: difficulties,
                content_type: contentType,
                correct: Math.round(correctPercent),
            };

            const fetch = await updateUserHistory({
                item: newItem,
                userId: userId,
            });
            console.log(fetch);
        }
    };

    useEffect(() => {
        if (chosenQuestions.length && currentCard >= chosenQuestions.length) {
            userHistory();
        }
    }, [currentCard]);

    return (
        <section className={style.studyContainer}>
            <section className={style.studyTitle}>
                {titles.length > 0 ? (
                    titles.map((item, index) => <h3 key={index}>{item}</h3>)
                ) : (
                    <h6>{}</h6>
                )}
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
                        {currentCard < chosenQuestions.length && (
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
                        )}
                        {chosenQuestions.length > 0 &&
                            currentCard >= chosenQuestions.length && (
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

export default Study;
