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

    const enterHandlerInput = (answer: string) => {
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

        const isCorrectMatches = chosenArray?.every((item, index) =>
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
            setText("");
        }
    };

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
            className={style.textInputWrap}
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
