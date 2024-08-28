import { Dispatch, RefObject, SetStateAction } from "react";
import { useRef, useState, useEffect } from "react";
import style from "./study.module.scss";
import { motion, MotionValue, AnimatePresence } from "framer-motion";
import { CombinedType } from "./study";
import { HiCheck } from "react-icons/hi2";
import { HiMiniXMark } from "react-icons/hi2";
import IndividualCard from "./individualCard";

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
    // States Controlling swipe icons
    const [showSwipeIcon, setShowSwipeIcon] = useState<
        "correct" | "incorrect" | null
    >(null);
    const cardRef = useRef<Array<RefObject<HTMLDivElement>>>([]);

    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [isSelectable, setIsSelectable] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setIsAnimating(false);
        }, 200);
        setTimeout(() => {
            setIsSelectable(true);
        }, 800);
    }, [currentCard]);

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
                transition={{
                    duration: 0.2,
                    ease: [0.075, 0.82, 0.165, 1],
                }}
            >
                {flashCardItemsTest.map((item, index) => {
                    return (
                        <IndividualCard
                            index={index}
                            item={item}
                            isFlipped={isFlipped}
                            xSet={xSet}
                            isAnimating={isAnimating}
                            setShowSwipeIcon={setShowSwipeIcon}
                            showSwipeIcon={showSwipeIcon}
                            answerHandler={answerHandler}
                            flipCard={flipCard}
                            currentCard={currentCard}
                            setIsAnimating={setIsAnimating}
                            setIsSelectable={setIsSelectable}
                            isSelectable={isSelectable}
                            cardRef={cardRef}
                        />
                    );
                })}
            </motion.div>
        </>
    );
}

export default InteractiveCard;
