import { Flashcard_collection_preview } from "@/app/_types/types";
import { create } from "zustand";

type UsePreviewModalTypes = {
    isUsePreviewModalOn: boolean;
    showUsePreviewModal: () => void;
    hideUsePreviewModal: () => void;
    setPreviewCollectionItems: (item: Flashcard_collection_preview) => void;
    previewCollectionItems: Flashcard_collection_preview | null;
};

export const usePreviewModal = create<UsePreviewModalTypes>()((set) => ({
    isUsePreviewModalOn: false,
    previewCollectionItems: null,
    showUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: true })),
    hideUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: false })),
    setPreviewCollectionItems: (item: Flashcard_collection_preview) =>
        set(() => ({ previewCollectionItems: item })),
}));
