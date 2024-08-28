"use client";

import React, {
    Dispatch,
    RefObject,
    SetStateAction,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import {
    motion,
    MotionValue,
    useAnimation,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import style from "./study.module.scss";
import { CombinedType } from "./study";

type IndividualCardTypes = {
    item: CombinedType;
    isFlipped: boolean;
    xSet: MotionValue<number>;
    isAnimating: boolean;
    setShowSwipeIcon: Dispatch<SetStateAction<"correct" | "incorrect" | null>>;
    showSwipeIcon: "correct" | "incorrect" | null;
    answerHandler: ({ correct }: { correct: boolean }) => void;
    flipCard: () => void;
    currentCard: number;
    index: number;
    setIsAnimating: Dispatch<SetStateAction<boolean>>;
    setIsSelectable: Dispatch<SetStateAction<boolean>>;
    isSelectable: boolean;
    cardRef: RefObject<Array<RefObject<HTMLDivElement>>>;
};

function IndividualCard({
    item,
    isFlipped,
    xSet,
    isAnimating,
    setShowSwipeIcon,
    showSwipeIcon,
    answerHandler,
    flipCard,
    currentCard,
    index,
    setIsAnimating,
    setIsSelectable,
    isSelectable,
    cardRef,
}: IndividualCardTypes) {
    const controls = useAnimation();

    //Rotating Cards relative to mouse
    const ySet = useMotionValue(isFlipped ? 180 : 0);
    const xSpring = useSpring(xSet, {
        damping: 20,
        stiffness: 250,
    });
    const ySpring = useSpring(ySet);

    const transform = useMotionTemplate`rotateY(${xSpring}deg) rotateX(${ySpring}deg)`;

    const ROTATE_VALUE = 25;

    const cardMoveHandler = (
        e: React.MouseEvent<HTMLDivElement>,
        index: number
    ) => {
        const cardElement = cardRef.current?.[index]?.current;
        if (!cardElement || isAnimating) return;

        const xFlip = isFlipped ? 180 : 0;
        const xCard = cardElement.getBoundingClientRect().left;
        const yCard = cardElement.getBoundingClientRect().top;
        const xClient = e.clientX;
        const yClient = e.clientY;
        const xWidth = cardElement.getBoundingClientRect().width;
        const yHeight = cardElement.offsetHeight;

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

    // swipe feature to designate card as correct/incorrect
    const isDragging = useRef<boolean>(false);
    const initialX = useRef<number>(0);

    const xDrag = useSpring(useMotionValue(0));
    const [currentDraged, setCurrentDragged] = useState<string | null>(null);

    const holdFlashCard = (e: React.MouseEvent, id: string) => {
        isDragging.current = true;
        initialX.current = e.clientX;
        setCurrentDragged(id);
    };

    const draggingFlashCard = (e: React.MouseEvent) => {
        if (isDragging.current && initialX.current) {
            const screenWidth = document.documentElement.clientWidth;
            const transformValue = e.clientX - initialX.current;

            // translates card on x axis
            xDrag.set(transformValue);

            // Displays swipe icons
            const movePercentage = transformValue / screenWidth;
            if (movePercentage > 0.15 && showSwipeIcon !== "correct") {
                setShowSwipeIcon("correct");
            } else if (
                movePercentage < -0.15 &&
                showSwipeIcon !== "incorrect"
            ) {
                setShowSwipeIcon("incorrect");
            }
        }
    };

    const releaseFlashCard = (e: React.MouseEvent) => {
        if (isDragging.current === false) return;
        setShowSwipeIcon(null);
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
                transition: {
                    duration: 0.3,
                    ease: [0.075, 0.82, 0.165, 1],
                },
            })
            .then(() => {
                setCurrentDragged(null);
            });
    };

    // HatchedCardPattern
    const CardPattern = ({
        text,
        textRef,
    }: {
        text: string;
        textRef: RefObject<HTMLSpanElement>;
    }) => {
        return (
            <>
                <aside className={style.backgroundone}></aside>
                <aside className={style.backgroundHatch}></aside>
                <aside ref={textRef} className={style.backgroundtwo}></aside>
                <aside className={style.cardFaceLabel}>{text}</aside>
            </>
        );
    };

    // Sizing text if it is beyond background height
    const questionTextRef = useRef<HTMLDivElement>(null);
    const questionbackgroundRef = useRef<HTMLDivElement>(null);
    const answerTextRef = useRef<HTMLDivElement>(null);
    const answerbackgroundRef = useRef<HTMLDivElement>(null);

    const [questionFontSize, setQuestionFontSize] = useState<string>("1rem");
    const [answerFontSize, setAnswerFontSize] = useState<string>("1rem");

    const sizeChecker = useCallback(() => {
        if (questionTextRef.current && questionbackgroundRef.current) {
            const questionHeight = questionTextRef.current.offsetHeight;
            const questionBackgroundHeight =
                questionbackgroundRef.current.offsetHeight;
            if (questionHeight > questionBackgroundHeight) {
                console.log(item.item_question);
                setQuestionFontSize("0.7rem");
            } else {
                setQuestionFontSize("1rem");
            }
        }

        if (answerTextRef.current && answerbackgroundRef.current) {
            const answerHeight = answerTextRef.current.offsetHeight;
            const answerBackgroundHeight =
                answerbackgroundRef.current.offsetHeight;
            if (answerHeight > answerBackgroundHeight) {
                setAnswerFontSize("0.7rem");
            } else {
                setAnswerFontSize("1rem");
            }
        }
    }, []);

    useEffect(() => {
        sizeChecker();
    }, [sizeChecker]);

    return (
        // Controls drag move in x direction / swiping card left and right
        <motion.div
            key={`${item.id}-interactive-card`}
            onMouseDown={(e: React.MouseEvent<HTMLDivElement>) =>
                holdFlashCard(e, item.id)
            }
            onMouseUp={releaseFlashCard}
            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => (
                cardMoveHandler(e, index), draggingFlashCard(e)
            )}
            onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => (
                cardLeaveHandler(e), releaseFlashCard(e)
            )}
            style={{
                zIndex: currentCard === index ? 10000 - index : index,
                padding: currentDraged === item.id ? "30rem" : "0rem",
                pointerEvents: isSelectable ? "auto" : "none",
            }}
            className={style.flashCardItemDrag}
        >
            {/* Controls drag transform translation */}
            <motion.div
                style={{
                    x: currentDraged === item.id ? xDrag : 0,
                }}
                animate={controls}
            >
                {/* Controls order of card being displayed into viewport based on current card state */}
                <motion.div
                    className={style.flashCardListItem}
                    initial={{ y: "-100vh", x: "0" }}
                    animate={{
                        y:
                            isAnimating === false && currentCard >= index
                                ? "0"
                                : "-100vh",
                        x:
                            currentCard > index
                                ? `${(item.correct ? 1 : -1) * 100}vw`
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
                        ref={(el) => {
                            cardRef.current![index] = {
                                current: el,
                            };
                        }}
                        style={{
                            transform:
                                currentCard === index ? transform : "none",
                        }}
                        className={style.flashCardWrapper}
                        key={item.id}
                    >
                        <div className={style.flashCard}>
                            <div className={style.flashFront}>
                                <div className={style.flashCardQuestion}>
                                    <div
                                        className={style.cardContent}
                                        ref={questionTextRef}
                                    >
                                        {item.question_img && (
                                            <div
                                                className={style.imageContainer}
                                            >
                                                <img src={item.question_img} />
                                            </div>
                                        )}
                                        <span
                                            style={{
                                                fontSize: questionFontSize,
                                            }}
                                        >
                                            {item.item_question}
                                        </span>
                                    </div>
                                    <CardPattern
                                        textRef={questionbackgroundRef}
                                        text="Question"
                                    />
                                </div>
                            </div>
                            <div className={style.flashBack}>
                                <div className={style.flashCardAnswer}>
                                    <div
                                        className={style.cardContent}
                                        ref={answerTextRef}
                                    >
                                        {item.answer_img && (
                                            <div
                                                className={style.imageContainer}
                                            >
                                                <img src={item.answer_img} />
                                            </div>
                                        )}
                                        <span
                                            style={{
                                                fontSize: answerFontSize,
                                            }}
                                        >
                                            {item.item_answer}
                                        </span>
                                    </div>
                                    <CardPattern
                                        textRef={answerbackgroundRef}
                                        text="Answer"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default IndividualCard;
