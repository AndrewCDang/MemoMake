"use client";

import useRevisionFlashItems from "@/app/_hooks/useRevisionFlashItems";
import { Flashcard_item } from "@/app/_types/types";

function useStartRevision({ items }: { items: Flashcard_item[] }) {
    const { setQuestions, setIncorrectQuestions } = useRevisionFlashItems();
    setIncorrectQuestions([]);
    setQuestions(items);
}

export default useStartRevision;
