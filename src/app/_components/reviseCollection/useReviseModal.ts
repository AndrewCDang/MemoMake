import {
    Flashcard_collection_preview,
    Flashcard_item,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { create } from "zustand";

type UseReviseModalTypes = {
    initialCollectionItems: Flashcard_collection_preview[];
    initialSetItems: Flashcard_set_with_cards[];
    reviseModalType: "collection" | "set" | null;
    isReviseModalOn: boolean;
    showReviseModal: () => void;
    hideReviseModal: () => void;
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
    removeFromCollection: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_collection_preview[];
    }) => void;
    removeFromSet: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_set_with_cards[];
    }) => void;
};

export const useReviseModal = create<UseReviseModalTypes>()((set) => ({
    initialCollectionItems: [],
    initialSetItems: [],
    reviseModalType: null,
    isReviseModalOn: false,
    showReviseModal: () => set(() => ({ isReviseModalOn: true })),
    hideReviseModal: () => set(() => ({ isReviseModalOn: false })),
    setInitialCollectionItems: ({
        item,
        existingItems = [],
    }: {
        item: Flashcard_collection_preview | Flashcard_collection_preview[];
        existingItems?: Flashcard_collection_preview[];
    }) =>
        set(() => {
            // Adding group of 'collection items'
            if (Array.isArray(item)) {
                return {
                    initialCollectionItems: item,
                    reviseModalType: "collection",
                };
            } else {
                // Adding item into new modal (no existing items)
                if (existingItems.length === 0) {
                    return {
                        initialCollectionItems: [item],
                        reviseModalType: "collection",
                    };
                }
                // Filtering repeat collection
                if (
                    existingItems &&
                    existingItems
                        .map((collection) => collection.id)
                        .includes(item.id)
                ) {
                    const collectionWithoutItem = existingItems.filter(
                        (collection) => collection.id !== item.id
                    );
                    return {
                        initialCollectionItems: collectionWithoutItem,
                        reviseModalType: "collection",
                    };
                    // If no repeats, append collection at end of array
                } else if (existingItems) {
                    {
                        return {
                            initialCollectionItems: [...existingItems, item],
                            reviseModalType: "collection",
                        };
                    }
                }
                return {
                    initialCollectionItems: [item],
                    reviseModalType: "collection",
                };
            }
        }),
    setInitalSet: ({
        item,
        existingItems = [],
    }: {
        item: Flashcard_set_with_cards[];
        existingItems?: Flashcard_set_with_cards[];
    }) =>
        set(() => {
            if (existingItems.length === 0) {
                return { initialSetItems: item, reviseModalType: "set" };
            }
            if (
                existingItems &&
                existingItems.some((setItem) =>
                    item.map((item) => item.id).includes(setItem.id)
                )
            ) {
                const setWithouhtItem = existingItems.filter(
                    (setItem) =>
                        !item.map((item) => item.id).includes(setItem.id)
                );
                return {
                    initialSetItems: setWithouhtItem,
                    reviseModalType: "set",
                };
            } else if (existingItems.length > 0) {
                return {
                    initialSetItems: [...existingItems, ...item],
                    reviseModalType: "set",
                };
            }
            return { initialSetItems: [], reviseModalType: "set" };
        }),
    removeFromCollection: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_collection_preview[];
    }) =>
        set(() => {
            const filteredCollection = existingItems.filter(
                (item) => item.id !== id
            );

            return { initialCollectionItems: filteredCollection };
        }),
    removeFromSet: ({
        id,
        existingItems,
    }: {
        id: string;
        existingItems: Flashcard_set_with_cards[];
    }) =>
        set(() => {
            const filteredCollection = existingItems.filter(
                (item) => item.id !== id
            );

            return { initialSetItems: filteredCollection };
        }),
}));
