import { create } from "zustand";

type ReviseModalTypes = {
    isReviseModalOn: boolean;
    openReviseModal: () => void;
    closeReviseModal: () => void;
};

const useReviseModal = create<ReviseModalTypes>((set) => ({
    isReviseModalOn: false,
    openReviseModal: () => set(() => ({ isReviseModalOn: true })),
    closeReviseModal: () => set(() => ({ isReviseModalOn: false })),
}));

export default useReviseModal;
