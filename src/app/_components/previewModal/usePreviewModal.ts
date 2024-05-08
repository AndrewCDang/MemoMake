import { create } from "zustand";

type UsePreviewModalTypes = {
    isUsePreviewModalOn: boolean;
    showUsePreviewModal: () => void;
    hideUsePreviewModal: () => void;
}

export const usePreviewModal = create<UsePreviewModalTypes>()((set)=>({
    isUsePreviewModalOn:false,
    showUsePreviewModal:()=>set(()=>({isUsePreviewModalOn:true})),
    hideUsePreviewModal:()=>set(()=>({isUsePreviewModalOn:false})),
}))

