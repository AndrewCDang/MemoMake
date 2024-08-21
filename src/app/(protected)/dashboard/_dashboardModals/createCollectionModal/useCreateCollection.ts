import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { create } from "zustand";

type CreateCollectionTypes = {
    isCreateCollectionModalOn: boolean;
    isEdit: boolean;
    editedItem: Flashcard_collection_set_joined | null;
    showCreateCollectionModal: () => void;
    hideCreateCollectionModal: () => void;
    showEditCollectionModal: (item: Flashcard_collection_set_joined) => void;
};

export const useCreateCollectionModal = create<CreateCollectionTypes>()(
    (set) => ({
        isCreateCollectionModalOn: false,
        isEdit: false,
        editedItem: null,
        showCreateCollectionModal: () =>
            set(() => ({ isCreateCollectionModalOn: true })),
        hideCreateCollectionModal: () => (
            set(() => ({ isCreateCollectionModalOn: false })),
            set({ isEdit: false })
        ),
        showEditCollectionModal: (item: Flashcard_collection_set_joined) => (
            set({ editedItem: item }),
            set({ isEdit: true }),
            set({ isCreateCollectionModalOn: true })
        ),
    })
);
