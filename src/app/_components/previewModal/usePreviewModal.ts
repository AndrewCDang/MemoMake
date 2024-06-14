import {
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { create } from "zustand";

type Collection = Flashcard_collection_preview | Flashcard_set_with_cards[];

type PreviewItemType = {
    type: "collection" | "set" | null;
    content: Collection | null;
};

type UsePreviewModalTypes = {
    isUsePreviewModalOn: boolean;
    showUsePreviewModal: () => void;
    hideUsePreviewModal: () => void;
    setPreviewCollectionItems: ({ type, content }: PreviewItemType) => void;
    previewCollectionItems: PreviewItemType;
};

export const usePreviewModal = create<UsePreviewModalTypes>()((set) => ({
    isUsePreviewModalOn: false,
    previewCollectionItems: { type: null, content: null },
    showUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: true })),
    hideUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: false })),
    setPreviewCollectionItems: ({ type, content }: PreviewItemType) =>
        set(() => ({
            previewCollectionItems: { type: type, content: content },
        })),
}));
