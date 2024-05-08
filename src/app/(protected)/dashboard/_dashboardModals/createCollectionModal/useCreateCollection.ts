import { create } from "zustand";

type CreateCollectionTypes = {
    isCreateCollectionModalOn: boolean;
    showCreateCollectionModal: () => void;
    hideCreateCollectionModal: () => void;
};

export const useCreateCollectionModal = create<CreateCollectionTypes>()(
    (set) => ({
        isCreateCollectionModalOn: false,
        showCreateCollectionModal: () =>
            set(() => ({ isCreateCollectionModalOn: true })),
        hideCreateCollectionModal: () =>
            set(() => ({ isCreateCollectionModalOn: false })),
    })
);
