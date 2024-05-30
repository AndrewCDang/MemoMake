import { Flashcard_collection_preview, Flashcard_item, Flashcard_set_with_cards } from "@/app/_types/types";
import { create } from "zustand";

type UseReviseModalTypes = {
    initialCollectionItems: Flashcard_collection_preview[];
    initialSet: Flashcard_set_with_cards[];
    isReviseModalOn: boolean;
    showReviseModal: () => void;
    hideReviseModal:() => void;
    setInitialCollectionItems: (item:Flashcard_collection_preview) => void;
    setInitalSet: (item:Flashcard_set_with_cards) => void;
}

export const useReviseModal = create<UseReviseModalTypes>()((set)=>({
    initialCollectionItems:[],
    initialSet:[],
    isReviseModalOn:false,
    showReviseModal:()=>set(()=>({isReviseModalOn:true})),
    hideReviseModal:()=>set(()=>({isReviseModalOn:false})),
    setInitialCollectionItems:(item:Flashcard_collection_preview)=>set(()=>({initialCollectionItems:[item]})),
    setInitalSet:(item:Flashcard_set_with_cards)=>set(()=>({initialSet:[item]}))
}))

