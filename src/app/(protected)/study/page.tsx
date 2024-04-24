"use client";
import React, { MouseEventHandler, RefObject, useEffect, useRef } from "react";
import useRevisionFlashItems from "@/app/_hooks/useRevisionFlashItems";
import InteractButtons from "./components/interactButtons/interactButtons";
import style from "./study.module.scss";
import { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Flashcard_item } from "@/app/_types/types";
import {
    useMotionValue,
    useTransform,
    useSpring,
    useMotionTemplate,
} from "framer-motion";
import FlashResults from "./flashResults/flashResults";
import ResultButtons from "./components/resultButtons/resultButtons";

type FlashCardItemsTest<T> = T & {
    correct: boolean | null;
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
    const {
        questions,
        setQuestions,
        incorrectQuestions,
        setIncorrectQuestions,
    } = useRevisionFlashItems();

    const controls = useAnimation();
    const controlsSecondary = useAnimation();

    const diffOptions = ["NA", "EASY", "MEDIUM", "HARD"];
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
        return { ...item, correct: null };
    }) as CombinedType[];

    const [currentCard, setCurrentCard] = useState<number>(0);
    const [questionCorrect, setQuestionCorrect] = useState<number>(1);
    const [flashCardItemsTest, setFlashCardItemsTest] = useState<
        CombinedType[]
    >([...initialTestCards]);
    const [isFlipped, setIsFlipped] = useState<boolean>(false);

    //Rotating Cards relative to mouse

    const cardRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const xSet = useMotionValue(0);
    const ySet = useMotionValue(isFlipped ? 180 : 0);
    const xSpring = useSpring(xSet, { damping: 20, stiffness: 100 });
    const ySpring = useSpring(ySet);

    const transform = useMotionTemplate`rotateY(${xSpring}deg) rotateX(${ySpring}deg)`;

    const ROTATE_VALUE = 25;
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isSelectable, setIsSelectable] = useState<boolean>(true);

    const cardMoveHandler = (
        e: React.MouseEvent<HTMLDivElement>,
        index: number
    ) => {
        if (!cardRef.current[index].current) return;
        if (isAnimating) return;

        const xFlip = isFlipped ? 180 : 0;
        const xCard = e.currentTarget.getBoundingClientRect().left;
        const yCard = e.currentTarget.getBoundingClientRect().top;
        const xClient = e.clientX;
        const yClient = e.clientY;
        const xWidth =
            cardRef.current[index].current.getBoundingClientRect().width;
        const yHeight = cardRef.current[index].current.offsetHeight;

        const xCenter = xWidth / 2;
        const yCenter = yHeight / 2;

        const xPos = (xClient - xCard - xCenter) * (ROTATE_VALUE / xCenter);
        const yPos =
            (yClient - yCard - yCenter) *
            (ROTATE_VALUE / yCenter) *
            (isFlipped ? 1 : -1);

        xSet.set(xFlip + xPos);
        ySet.set(yPos);
    };

    const cardLeaveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        const xFlip = isFlipped ? 180 : 0;

        xSet.set(xFlip);
        ySet.set(0);
    };

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

    // swipe feature to designate card as correct/inccorect
    const isDragging = useRef<boolean>(false);
    const initialX = useRef<number>(0);

    const xDrag = useSpring(useMotionValue(0));
    const [currentDraged, setCurrentDragged] = useState<string | null>(null);
    const [topLighting, setTopLighting] = useState<boolean>(false);

    const answerHandler = ({ correct }: { correct: boolean }) => {
        console.log(correct);
        setQuestionCorrect(correct ? 1 : -1);

        setFlashCardItemsTest((prevState) => {
            return prevState.map((item, index) => {
                if (index === currentCard) {
                    return { ...item, correct: correct };
                }
                return item;
            });
        });

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

    const holdFlashCard = (e: React.MouseEvent, id: string) => {
        isDragging.current = true;
        initialX.current = e.clientX;
        console.log(e.clientX);
        console.log(id);

        setCurrentDragged(id);
    };

    const draggingFlashCard = (e: React.MouseEvent) => {
        if (isDragging.current && initialX.current) {
            const transformValue = e.clientX - initialX.current;
            xDrag.set(transformValue);
        }
    };

    const releaseFlashCard = (e: React.MouseEvent) => {
        if (isDragging.current === false) return;

        isDragging.current = false;
        const xDiff = e.clientX - initialX.current;
        const screenWidth = document.documentElement.clientWidth;
        const movedPercentage = xDiff / screenWidth;
        xSet.set(0);
        ySet.set(0);

        if (movedPercentage > 0.2) {
            setIsAnimating(true);
            setIsSelectable(false);
            answerHandler({ correct: true });
        } else if (movedPercentage < -0.2) {
            setIsAnimating(true);
            setIsSelectable(false);
            answerHandler({ correct: false });
        } else if (movedPercentage < 0.05 && movedPercentage > -0.05) {
            flipCard();
        }

        controls
            .start({
                x: 0,
                y: 0,
                rotateX: 0,
                rotateY: 0,
                transition: { type: "spring", stiffness: 500, damping: 30 },
            })
            .then(() => {
                setCurrentDragged(null);
            });
    };

    useEffect(() => {
        setTimeout(() => {
            setIsAnimating(false);
        }, 200);
        setTimeout(() => {
            setIsSelectable(true);
        }, 800);

        if (currentCard < flashCardItemsTest.length) {
            console.log(initialTestCards);
        }
    }, [currentCard]);

    return (
        <section className={style.studyContainer}>
            {currentCard < flashCardItemsTest.length ? (
                <div className={style.flashCardContainer}>
                    {flashCardItemsTest.map((item, index) => {
                        return (
                            // Controls drag move in x direction / swiping card left and right
                            <motion.div
                                onMouseDown={(e) => holdFlashCard(e, item.id)}
                                onMouseUp={releaseFlashCard}
                                onMouseMove={(e) => (
                                    cardMoveHandler(e, index),
                                    draggingFlashCard(e)
                                )}
                                onMouseLeave={(e) => (
                                    cardLeaveHandler(e), releaseFlashCard(e)
                                )}
                                style={{
                                    x: currentDraged === item.id ? xDrag : 0,
                                    zIndex:
                                        currentCard === index
                                            ? 10000 - index
                                            : index,
                                    padding:
                                        currentDraged === item.id ? "30rem" : 0,
                                    pointerEvents: isSelectable
                                        ? "auto"
                                        : "none",
                                }}
                                animate={controls}
                                className={style.flashCardItemDrag}
                            >
                                {/* Controls order of card being displayed into viewport based on current card state */}
                                <motion.div
                                    className={style.flashCardListItem}
                                    initial={{ y: "-100vh", x: "0" }}
                                    animate={{
                                        y:
                                            isAnimating === false &&
                                            currentCard >= index
                                                ? "0"
                                                : "-100vh",
                                        x:
                                            currentCard > index
                                                ? `${
                                                      (item.correct ? 1 : -1) *
                                                      100
                                                  }vw`
                                                : "0",
                                        rotate:
                                            currentCard > index
                                                ? (isFlipped ? -1 : 1) * 180
                                                : 0,
                                    }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 120,
                                        damping: 15,
                                    }}
                                >
                                    {/* Controls card rotation about mouse cursor */}
                                    <motion.div
                                        ref={(el) =>
                                            (cardRef.current[index] = {
                                                current: el,
                                            })
                                        }
                                        style={{
                                            transform:
                                                currentCard === index
                                                    ? transform
                                                    : "none",
                                        }}
                                        className={style.flashCardWrapper}
                                        key={item.id}
                                    >
                                        <div className={style.flashCard}>
                                            <div className={style.flashFront}>
                                                <div
                                                    className={
                                                        style.flashCardQuestion
                                                    }
                                                >
                                                    "{item.item_question}"
                                                </div>
                                            </div>
                                            <div className={style.flashBack}>
                                                <div
                                                    className={
                                                        style.flashCardQuestion
                                                    }
                                                >
                                                    "{item.item_answer}"
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                // Displays Results when all questions have been answered
                <FlashResults flashCardItemsTest={flashCardItemsTest} />
            )}
            {/* Lighting Effect when new card added */}
            <motion.div
                animate={{
                    opacity: topLighting ? 0.5 : 0,
                    top: topLighting ? "5%" : "-5%",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={style.newCardLight}
                onAnimationComplete={() => setTopLighting(false)}
            ></motion.div>

            {/* Interactive Buttons at bottom */}
            {currentCard < flashCardItemsTest.length ? (
                <InteractButtons
                    setIsFlipped={setIsFlipped}
                    flipCard={flipCard}
                    answerHandler={answerHandler}
                />
            ) : (
                <ResultButtons />
            )}
        </section>
    );
}

export default page;
