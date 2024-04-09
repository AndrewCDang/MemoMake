import { create } from "zustand";

type useLogInModalType = {
    signUpModal: boolean;
    showSignUpModal: () => void;
    removeSignUpModal: () => void;
};

export const useSignUpModal = create<useLogInModalType>()((set) => ({
    signUpModal: false,
    showSignUpModal: () => set(() => ({ signUpModal: true })),
    removeSignUpModal: () => set(() => ({ signUpModal: false })),
}));
