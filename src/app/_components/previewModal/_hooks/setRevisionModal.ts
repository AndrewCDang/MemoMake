import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { usePreviewModal } from "../usePreviewModal";
import { useReviseModal } from "../../reviseCollection/useReviseModal";

export const setRevisionModal = () => {
    const { previewCollectionItems } = usePreviewModal();

    const { setInitialCollectionItems, setInitalSet } = useReviseModal();

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
