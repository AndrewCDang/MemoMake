import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { PreviewItemType, usePreviewModal } from "../usePreviewModal";
import { useReviseModal } from "../../reviseCollection/useReviseModal";

type SetRevisionModalTypes = {
    previewCollectionItems: PreviewItemType;
    setInitialCollectionItems: ({
        item,
        existingItems,
    }: {
        item: Flashcard_collection_preview | Flashcard_collection_preview[];
        existingItems?: Flashcard_collection_preview[];
    }) => void;
    setInitalSet: ({
        item,
        existingItems,
    }: {
        item: Flashcard_set_with_cards[];
        existingItems?: Flashcard_set_with_cards[];
    }) => void;
};

export const setRevisionModal = ({
    previewCollectionItems,
    setInitialCollectionItems,
    setInitalSet,
}: SetRevisionModalTypes) => {
    if (previewCollectionItems) {
        if (
            previewCollectionItems.type === "collection" &&
            previewCollectionItems.content
        ) {
            setInitialCollectionItems({
                item: previewCollectionItems.content as Flashcard_collection_preview,
            });
        } else if (
            previewCollectionItems.type === "set" &&
            previewCollectionItems.content
        ) {
            setInitalSet({
                item: previewCollectionItems.content as Flashcard_set_with_cards[],
            });
        }
    }
};
