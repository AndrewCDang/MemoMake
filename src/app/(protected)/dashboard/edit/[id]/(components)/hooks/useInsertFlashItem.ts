import { Flashcard_item } from "@/app/_types/types";
import { create } from "zustand";

type InsertFlashItemType = {
    useFlashcard: Flashcard_item | null;
    setFlashCards: (flashcards: Flashcard_item) => void;
};

/**
 *
 * @param flashcards Flashcard_item[]
 * @param insertFlashCard (flashcard)=>void | Appends flashcard
 */
export const useInsertFlashItem = create<InsertFlashItemType>()((set) => ({
    useFlashcard: null,
    setFlashCards: (flashcard) => set(() => ({ useFlashcard: flashcard })),
}));
