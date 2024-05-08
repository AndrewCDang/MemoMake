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
