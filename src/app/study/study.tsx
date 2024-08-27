"use client";
import React, { useEffect } from "react";
import InteractButtons from "./components/interactButtons/interactButtons";
import style from "./study.module.scss";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue } from "framer-motion";
import FlashResults from "./flashResults/flashResults";
import ResultButtons from "./components/resultButtons/resultButtons";
import InteractiveCard from "./interactiveCard";
import {
    ContentType,
    Difficulty,
    Flashcard_collection_with_cards,
    Flashcard_item,
    Flashcard_set_with_cards,
} from "../_types/types";
import { updateUserHistory } from "./components/userHistory/userHistory";
import LoadingCircle from "../_components/loadingUi/loadingCircle";
import StudyTextInput from "./components/textInput/studyTextInput";
import { shuffleArray } from "../_functions/shuffleArray";
import { BannerIcon } from "../_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";
import { IconContainer } from "../_components/setAndCollectionCard/generalComponents/bannerStrip/bannerStrip";
import { colours } from "../styles/colours";

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
    data: Flashcard_collection_with_cards[] | Flashcard_set_with_cards[];
};

function Study({
    data,
    ids,
    contentType,
    tags,
    difficulties,
    userId,
}: StudyTypes) {
    // States for titles/subtitles
    const getTitle = () => {
        if (ids.length === 1 && data[0].content_type === "collection") {
            return data[0].collection_name;
        } else if (ids.length === 1 && data[0].content_type === "set") {
            return data[0].set_name;
        }
        if (data.length > 1) {
            if (contentType === "collection") {
                return "Multiple Collections";
            } else if (contentType === "set") {
                return "Multiple Sets";
            }
        }
        return "";
    };

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

    const flashCards = data.flatMap((col) => col.flashcards);
    const uniqueFlashCards = flashCards.filter(
        (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    const [flashCardItemsTest, setFlashCardItemsTest] = useState<
        CombinedType[]
    >([...shuffleArray<CombinedType>(initialTestCards(uniqueFlashCards))]);

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
            setIsFlipped(false);
            xSet.set(0);

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
        }
    };

    useEffect(() => {
        if (chosenQuestions.length && currentCard >= chosenQuestions.length) {
            userHistory();
        }
    }, [currentCard]);

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <section className={style.studyContainer}>
            <section className={style.studyTitle}>
                <div className={style.studyCreator}>
                    <img
                        src={data[0].image}
                        className={style.bannerStudyImage}
                        alt=""
                    ></img>
                    <h4 className={style.studyTitleText}>{getTitle()}</h4>
                </div>
                <div className={style.studyCreator}>
                    {data.length === 1 && (
                        <BannerIcon
                            handler={() => null}
                            hoverText={data[0].creator.user_name || "OC"}
                        >
                            {data[0].creator.image ? (
                                <img
                                    src={data[0].creator.image}
                                    className={style.bannerProfileImage}
                                    alt=""
                                ></img>
                            ) : (
                                <div
                                    style={{
                                        backgroundColor: colours.yellow(),
                                    }}
                                    className={style.bannerProfileImage}
                                ></div>
                            )}
                        </BannerIcon>
                    )}
                    <div> {data.length === 1 && data[0].creator.user_name}</div>
                </div>
            </section>
            {chosenQuestions.length > 0 && isClient ? (
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
                            userId={userId}
                            flashCardItemsTest={chosenQuestions}
                            testIncorrect={testIncorrect}
                            setTestIncorrect={setTestIncorrect}
                        />
                    )}
                </AnimatePresence>
            ) : (
                <div className={style.loadingWrap}>
                    <LoadingCircle variant="contain" />
                </div>
            )}
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
                                {/* Text Input */}
                                <StudyTextInput
                                    flipCard={flipCard}
                                    currentCard={currentCard}
                                    chosenQuestions={chosenQuestions}
                                    answerHandler={answerHandler}
                                />
                                {/* Study Navigation Buttons */}
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
                                        userId={userId}
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
