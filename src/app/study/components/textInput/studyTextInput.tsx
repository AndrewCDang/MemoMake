import TextInput from "@/app/_components/textInput/inputField";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./studyTextInput.module.scss";
import { CombinedType } from "../../study";
import { set } from "zod";
import { debounce } from "@/app/_functions/debounce";

type StudyTextInputTypes = {
    currentCard: number;
    chosenQuestions: CombinedType[];
    answerHandler: ({ correct }: { correct: boolean }) => void;
    flipCard: () => void;
};

function StudyTextInput({
    currentCard,
    chosenQuestions,
    answerHandler,
    flipCard,
}: StudyTextInputTypes) {
    const [text, setText] = useState<string>("");
    const textRef = useRef<HTMLInputElement>(null);
    const [incorrect, setIncorrect] = useState<boolean>(false);
    const [correct, setCorrect] = useState<boolean>(false);

    const isAnimating = useRef(false);
    const enterIncorrectHandler = () => {
        if (!isAnimating.current) {
            setIncorrect(true);
            setTimeout(() => {
                setIncorrect(false);
            }, 1000);
        }
    };
    const enterCorrectHandler = () => {
        if (!isAnimating.current) {
            setCorrect(true);
            setTimeout(() => {
                setCorrect(false);
            }, 1000);
        }
    };

    const enterHandlerInput = (answer: string) => {
        if (answer.length === 0) return;
        const textArray = answer
            .toLocaleLowerCase()
            .replace(/[.!?@\-/,]/g, "")
            .split(" ")
            .filter((item) => item !== "");

        const chosenArray = chosenQuestions[currentCard].item_answer
            ?.toLocaleLowerCase()
            .replace(/[.!?@\-/,]/g, "")
            .split(" ")
            .filter((item) => item !== "");

        const isCorrectMatches = chosenArray?.every((item) =>
            textArray.includes(item)
        );
        const isCorrect =
            chosenQuestions[currentCard].item_answer?.toLocaleLowerCase() ===
            answer.toLocaleLowerCase();

        if (isCorrectMatches || isCorrect) {
            setTimeout(() => {
                flipCard();
            }, 0);
            setTimeout(() => {
                answerHandler({ correct: true });
            }, 500);
            enterCorrectHandler();
            isAnimating.current = true;
            setTimeout(() => {
                isAnimating.current = false;
            }, 1500);
            setText("");
        } else {
            enterIncorrectHandler();
            isAnimating.current = true;
            setTimeout(() => {
                isAnimating.current = false;
            }, 1500);
        }
    };

    useEffect(() => {
        if (text.length > 0) {
            const textArray = text
                .toLocaleLowerCase()
                .replace(/[.!?@\-/,]/g, "")
                .split(" ")
                .filter((item) => item !== "");

            const chosenArray = chosenQuestions[currentCard - 1].item_answer
                ?.toLocaleLowerCase()
                .replace(/[.!?@\-/,]/g, "")
                .split(" ")
                .filter((item) => item !== "");

            const isCorrectMatches = chosenArray?.every((item) =>
                textArray.includes(item)
            );
            const isCorrect =
                chosenQuestions[
                    currentCard - 1
                ].item_answer?.toLocaleLowerCase() === text.toLocaleLowerCase();

            if (isCorrectMatches || isCorrect) {
                enterCorrectHandler();
                isAnimating.current = true;
                setTimeout(() => {
                    isAnimating.current = false;
                }, 1500);
            }

            setText("");
        }
    }, [currentCard]);

    // Handles Transition of text input
    const [expandTextInput, setExpandTextInput] = useState<boolean>(false);

    const handleTextFocus = () => {
        setExpandTextInput(true);
    };

    const handleTextDefocus = () => {
        setExpandTextInput(false);
    };

    useEffect(() => {
        const textInput = textRef.current;

        if (textInput) {
            textInput.addEventListener("focus", handleTextFocus);
            textInput.addEventListener("blur", handleTextDefocus);
        }

        // Cleanup function to remove event listeners
        return () => {
            if (textInput) {
                textInput.removeEventListener("focus", handleTextFocus);
                textInput.removeEventListener("blur", handleTextDefocus);
            }
        };
    }, [textRef]);

    return (
        <div
            className={`${style.textInputWrap} ${
                text.length > 0 ? style.hasChars : ""
            } ${incorrect ? style.incorrect : ""}
                ${correct ? style.correct : ""}
            `}
            style={{
                gridTemplateColumns:
                    expandTextInput || text.length > 0 ? "1fr" : "0fr",
            }}
        >
            <div className={style.textInputContainer}>
                <TextInput
                    refObject={textRef}
                    height="short"
                    id="study-input"
                    placeholder="Type Answer"
                    type={"text"}
                    handler={(e) => setText(e.target.value)}
                    inputValue={text}
                    enterHandler={(enterHandler: string) =>
                        enterHandlerInput(enterHandler)
                    }
                />
            </div>
        </div>
    );
}

export default StudyTextInput;
