import { create } from "zustand";
import {
    Flashcard_item,
    Difficulty,
    Flashcard_collection_preview,
} from "../_types/types";

type StudyPage = {
    studyTitles: string[];
    studySubtitles: string[];
    studyType: "collection" | "set" | undefined;
};

type useRevisionFlashItemsTypes = {
    collectionItems: Flashcard_collection_preview[];
    questions: Flashcard_item[];
    difficulties: Difficulty[];
    tags: string[];
    studyPage: StudyPage;
    setStudyPage: ({
        studySubtitles,
        studyTitles,
        studyType,
    }: StudyPage) => void;
    incorrectQuestions: Flashcard_item[];
    setCollectionItem: (items: Flashcard_collection_preview[]) => void;
    setQuestions: (items: Flashcard_item[]) => void;
    setIncorrectQuestions: (items: Flashcard_item[]) => void;
};

const useRevisionFlashItems = create<useRevisionFlashItemsTypes>((set) => ({
    studyPage: { studySubtitles: [], studyTitles: [], studyType: undefined },
    collectionItems: [],
    setItems: [],
    questions: [],
    difficulties: [],
    tags: [],
    incorrectQuestions: [],
    setStudyPage: ({ studySubtitles, studyTitles, studyType }: StudyPage) =>
        set({
            studyPage: {
                studySubtitles: studySubtitles,
                studyTitles: studyTitles,
                studyType: studyType,
            },
        }),
    setCollectionItem: (items: Flashcard_collection_preview[]) =>
        set({ collectionItems: items }),
    setQuestions: (items: Flashcard_item[]) => set({ questions: items }),
    setDifficulties: (items: Difficulty[]) => set({ difficulties: items }),
    setTags: (items: string[]) => set({ tags: items }),
    setIncorrectQuestions: (items: Flashcard_item[]) =>
        set({ incorrectQuestions: items }),
}));

export default useRevisionFlashItems;
