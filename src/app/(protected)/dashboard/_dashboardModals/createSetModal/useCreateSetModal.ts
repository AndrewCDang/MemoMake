import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { create } from "zustand";

type UseCreateSetModalTypes = {
    isCreateSetModalOn: boolean;
    showCreateSetModal: () => void;
    hideCreateSetModal: () => void;
};

export const useCreateSetModal = create<UseCreateSetModalTypes>()((set) => ({
    isCreateSetModalOn: false,
    showCreateSetModal: () => set({ isCreateSetModalOn: true }),
    hideCreateSetModal: () => set({ isCreateSetModalOn: false }),
}));
