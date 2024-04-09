import { create } from "zustand";

type UseForgotTypes = {
    forgotModalisOpen: boolean;
    showForgotModal: () => void;
    closeForgotModal: () => void;
};

export const useForgotModal = create<UseForgotTypes>()((set) => ({
    forgotModalisOpen: false,
    showForgotModal: () => set(() => ({ forgotModalisOpen: true })),
    closeForgotModal: () => set(() => ({ forgotModalisOpen: false })),
}));
