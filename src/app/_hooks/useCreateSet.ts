import { create } from "zustand";

type CreateSetTypes = {
    createIsOpen: boolean;
    openCreateModal: () => void;
    closeCreateModal: () => void;
};

const useCreateModal = create<CreateSetTypes>()((set) => ({
    createIsOpen: false,
    openCreateModal: () => set(() => ({ createIsOpen: true })),
    closeCreateModal: () => set(() => ({ createIsOpen: false })),
}));

export default useCreateModal;
