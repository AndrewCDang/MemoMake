import { Dispatch, RefObject, SetStateAction } from "react";
import { useRef, useState, useEffect } from "react";
import style from "./study.module.scss";
import {
    motion,
    useMotionValue,
    useSpring,
    useMotionTemplate,
    useAnimation,
    MotionValue,
    AnimatePresence,
} from "framer-motion";
import { CombinedType } from "./study";
import { HiCheck } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";

type InteractiveCardTypes = {
    flashCardItemsTest: CombinedType[];
    currentCard: number;
    xSet: MotionValue<number>;
    isFlipped: boolean;
    answerHandler: ({ correct }: { correct: boolean }) => void;
    flipCard: () => void;
    topLighting: boolean;
    setTopLighting: Dispatch<SetStateAction<boolean>>;
};

function InteractiveCard({
    flashCardItemsTest,
    currentCard,
    xSet,
    isFlipped,
    answerHandler,
    flipCard,
    topLighting,
    setTopLighting,
}: InteractiveCardTypes) {
    const controls = useAnimation();

    //Rotating Cards relative to mouse

    const cardRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const ySet = useMotionValue(isFlipped ? 180 : 0);
    const xSpring = useSpring(xSet, { damping: 20, stiffness: 100 });
    const ySpring = useSpring(ySet);

    const transform = useMotionTemplate`rotateY(${xSpring}deg) rotateX(${ySpring}deg)`;

    const ROTATE_VALUE = 25;
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isSelectable, setIsSelectable] = useState<boolean>(true);

    // States Controlling swipe icons
    const [showSwipeIcon, setShowSwipeIcon] = useState<
        "correct" | "incorrect" | null
    >(null);

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

    // swipe feature to designate card as correct/inccorect
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
    }, [currentCard]);

    // HatchedCardPattern
    const CardPattern = ({ text }: { text: string }) => {
        return (
            <>
                <aside className={style.backgroundone}></aside>
                <aside className={style.backgroundHatch}></aside>
                <aside className={style.backgroundtwo}></aside>
                <aside className={style.cardFaceLabel}>{text}</aside>
            </>
        );
    };

    return (
        <>
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
            <AnimatePresence>
                {showSwipeIcon === "correct" && (
                    <motion.div
                        key={"correctSwipe"}
                        className={style.dragCorrectIcon}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: showSwipeIcon === "correct" ? 1 : 0,
                        }}
                        exit={{ opacity: 0, y: -16 }}
                    >
                        <HiCheck />
                    </motion.div>
                )}
                {showSwipeIcon === "incorrect" && (
                    <motion.div
                        key={"incorrectSwipe"}
                        className={style.dragIncorrectIcon}
                        initial={{ opacity: 0 }}
                        animate={{
                            opacity: showSwipeIcon === "incorrect" ? 1 : 0,
                        }}
                        exit={{ opacity: 0, y: -16 }}
                    >
                        <HiMiniXMark />
                    </motion.div>
                )}
            </AnimatePresence>
            <motion.div
                className={style.flashCardContainer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                {flashCardItemsTest.map((item, index) => {
                    return (
                        // Controls drag move in x direction / swiping card left and right
                        <motion.div
                            key={`${item.id}-interactive-card`}
                            onMouseDown={(e) => holdFlashCard(e, item.id)}
                            onMouseUp={releaseFlashCard}
                            onMouseMove={(e) => (
                                cardMoveHandler(e, index), draggingFlashCard(e)
                            )}
                            onMouseLeave={(e) => (
                                cardLeaveHandler(e), releaseFlashCard(e)
                            )}
                            style={{
                                // x: currentDraged === item.id ? xDrag : 0,
                                zIndex:
                                    currentCard === index
                                        ? 10000 - index
                                        : index,
                                padding:
                                    currentDraged === item.id
                                        ? "30rem"
                                        : "0rem",
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
                                                    <div
                                                        className={
                                                            style.cardContent
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                style.imageContainer
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    item.question_img
                                                                }
                                                            />
                                                        </div>
                                                        <span>
                                                            {item.item_question}
                                                        </span>
                                                    </div>
                                                    <CardPattern text="Question" />
                                                </div>
                                            </div>
                                            <div className={style.flashBack}>
                                                <div
                                                    className={
                                                        style.flashCardAnswer
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            style.cardContent
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                style.imageContainer
                                                            }
                                                        >
                                                            <img
                                                                src={
                                                                    item.question_img
                                                                }
                                                            />
                                                        </div>
                                                        <span>
                                                            {item.item_answer}
                                                        </span>
                                                    </div>
                                                    <CardPattern text="Answer" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </>
    );
}

export default InteractiveCard;
