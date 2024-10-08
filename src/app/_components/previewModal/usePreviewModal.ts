import {
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { create } from "zustand";

type Collection =
    | Flashcard_collection_preview
    | Flashcard_collection_preview[]
    | Flashcard_set_with_cards[];

export type PreviewItemType = {
    type: "collection" | "set" | null;
    content: Collection | null | undefined;
};

type UsePreviewModalTypes = {
    isUsePreviewModalOn: boolean;
    resetPreviewModal: () => void;
    showUsePreviewModal: () => void;
    hideUsePreviewModal: () => void;
    setPreviewCollectionItems: ({ type, content }: PreviewItemType) => void;
    previewCollectionItems: PreviewItemType;
};

export const usePreviewModal = create<UsePreviewModalTypes>()((set) => ({
    isUsePreviewModalOn: false,
    previewCollectionItems: { type: null, content: null },
    resetPreviewModal: () =>
        set(() => ({ previewCollectionItems: { type: null, content: null } })),
    showUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: true })),
    hideUsePreviewModal: () => set(() => ({ isUsePreviewModalOn: false })),
    setPreviewCollectionItems: ({ type, content }: PreviewItemType) =>
        set(() => ({
            previewCollectionItems: { type: type, content: content },
        })),
}));
