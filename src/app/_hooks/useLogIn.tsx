import { create } from "zustand";

type useLogInModalType = {
    logInModal: boolean;
    showLogInModal: () => void;
    removeLogInModal: () => void;
};

export const useLogInModal = create<useLogInModalType>()((set) => ({
    logInModal: false,
    showLogInModal: () => set(() => ({ logInModal: true })),
    removeLogInModal: () => set(() => ({ logInModal: false })),
}));
