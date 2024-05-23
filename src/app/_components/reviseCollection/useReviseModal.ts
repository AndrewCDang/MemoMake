import { Flashcard_collection_preview, Flashcard_item, Flashcard_set_with_cards } from "@/app/_types/types";
import { create } from "zustand";

type UseReviseModalTypes = {
    initialCollectionItems: Flashcard_collection_preview[] | null;
    initialSet: Flashcard_set_with_cards[] | null;
    isReviseModalOn: boolean;
    showReviseModal: () => void;
    hideReviseModal:() => void;
    setInitialCollectionItems: (item:Flashcard_collection_preview) => void;
    setInitalSet: (item:Flashcard_set_with_cards) => void;
}

export const UseReviseModal = create<UseReviseModalTypes>()((set)=>({
    initialCollectionItems:null,
    initialSet:null,
    isReviseModalOn:false,
    showReviseModal:()=>set(()=>({isReviseModalOn:true})),
    hideReviseModal:()=>set(()=>({isReviseModalOn:false})),
    setInitialCollectionItems:(item:Flashcard_collection_preview)=>set(()=>({initialCollectionItems:[item]})),
    setInitalSet:(item:Flashcard_set_with_cards)=>set(()=>({initialSet:[item]}))
}))

