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
import { useSearchParams } from "next/navigation";
import {
    Difficulty,
    Flashcard_collection_with_cards,
    Flashcard_item,
    Flashcard_set_with_cards,
    UserHistory,
} from "../_types/types";
import { studyFetchFlashCards } from "../_actions/studyFetchFlashCards";
import { updateUserHistory } from "./components/userHistory/userHistory";

const diffOptions: Difficulty[] = [
    Difficulty.NA,
    Difficulty.EASY,
    Difficulty.MEDIUM,
    Difficulty.HARD,
];

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

type StudyTypes = {
    collectionIds: string[];
    setIds: string[];
    collectionTags: string[];
    collectionDifficulties: Difficulty[];
    userId: string | undefined;
};

function Study({
    collectionIds,
    setIds,
    collectionTags,
    collectionDifficulties,
    userId,
}: StudyTypes) {
    const { collectionItems, questions } = useRevisionFlashItems();
    const searchParams = useSearchParams();
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

    const fetchFlashCards = async () => {
        try {
            if (!collectionIds && !setIds) return;

            // 2 Query flashcards with paramters
            const setTitleSubtitle = (title: string[], subtitle: string[]) => {
                setTitles(subtitle.map((item) => item));
                setSubTitles(title.map((item) => item));
            };

            if (collectionIds && collectionIds.length > 0) {
                const collection = await studyFetchFlashCards({
                    fetchObject: { type: "collection", id: collectionIds },
                    tags: collectionTags,
                    difficulties: collectionDifficulties,
                });
                // 3 Set flashcards and titles/subitles
                if (collection) {
                    console.log(collection);
                    const flashCards = collection.flatMap(
                        (col) => col.flashcards
                    );
                    const uniqueFlashCards = flashCards.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t.id === item.id)
                    );
                    setFlashCardItemsTest(
                        shuffleArray<CombinedType>(
                            initialTestCards(uniqueFlashCards)
                        )
                    );
                    const collectionTitles = (
                        collection as Flashcard_collection_with_cards[]
                    ).map((item) => item.collection_name);

                    const collectionSubtitles = (
                        collection as Flashcard_collection_with_cards[]
                    )
                        .flatMap((item) => item.sets)
                        .filter(
                            (item, index, self) =>
                                index === self.findIndex((t) => t === item)
                        );
                    setTitleSubtitle(collectionTitles, collectionSubtitles);
                }
            }
            if (setIds && setIds.length > 0) {
                const set = await studyFetchFlashCards({
                    fetchObject: { type: "set", id: setIds },
                    tags: collectionTags,
                    difficulties: collectionDifficulties,
                });
                // 3 Set flashcards and titles/subitles
                if (set) {
                    const flashCards = set.flatMap((col) => col.flashcards);
                    const uniqueFlashCards = flashCards.filter(
                        (item, index, self) =>
                            index === self.findIndex((t) => t.id === item.id)
                    );
                    setFlashCardItemsTest(
                        shuffleArray<CombinedType>(
                            initialTestCards(uniqueFlashCards)
                        )
                    );
                    const setTitles = (set as Flashcard_set_with_cards[]).map(
                        (item) => item.set_name
                    );

                    const setSubtitles = (set as Flashcard_set_with_cards[])
                        .flatMap((item) => item.set_categories)
                        .filter(
                            (item, index, self) =>
                                index === self.findIndex((t) => t === item)
                        );
                    setTitleSubtitle(setTitles, setSubtitles);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (questions.length === 0) {
            fetchFlashCards();
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

    // Updates user history (once) after user completes all questions initially
    const [historyUpdated, setHistoryUpdated] = useState<boolean>(false);
    const userHistory = async () => {
        if (userId) {
            const newItem: UserHistory = {
                ids:
                    collectionIds.length > 0
                        ? (collectionIds as any)
                        : (setIds as any),
                tags: collectionTags,
                difficulty: collectionDifficulties,
                content_type: collectionIds.length > 0 ? "collection" : "set",
            };

            console.log(newItem);

            const fetch = await updateUserHistory({
                item: newItem,
                userId: userId,
            });
            console.log(fetch);
        }
    };

    useEffect(() => {
        if (
            chosenQuestions.length &&
            currentCard >= chosenQuestions.length &&
            !historyUpdated
        ) {
            setTimeout(() => {
                setHistoryUpdated(true);
            }, 0);
            userHistory();
        } else if (currentCard >= chosenQuestions.length && historyUpdated) {
        }
    }, [currentCard]);

    return (
        <section className={style.studyContainer}>
            <section className={style.studyTitle}>
                {titles.length > 0 ? (
                    titles.map((item, index) => <h6 key={index}>{item}</h6>)
                ) : (
                    <h6>Loading</h6>
                )}
                <div className={style.setLabelContainer}>
                    {subTitles &&
                        subTitles.map((item, index) => (
                            <div key={index}>{item}</div>
                        ))}
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
