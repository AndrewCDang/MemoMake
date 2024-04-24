import { create } from "zustand";
import { Flashcard_item } from "../_types/types";

type useRevisionFlashItemsTypes = {
    questions: Flashcard_item[];
    incorrectQuestions: Flashcard_item[];
    setQuestions: (items: Flashcard_item[]) => void;
    setIncorrectQuestions: (items: Flashcard_item[]) => void;
};

const useRevisionFlashItems = create<useRevisionFlashItemsTypes>((set) => ({
    questions: [],
    incorrectQuestions: [],
    setQuestions: (items: Flashcard_item[]) => set({ questions: items }),
    setIncorrectQuestions: (items: Flashcard_item[]) =>
        set({ incorrectQuestions: items }),
}));

export default useRevisionFlashItems;
