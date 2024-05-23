"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import React from "react";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import style from "./collectionItem.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { Flashcard_collection_preview } from "@/app/_types/types";

function CollectionItemBtn({
    collectionItem,
}: {
    collectionItem: Flashcard_collection_set_joined;
}) {
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const handler = async () => {
        const setIds = collectionItem.set_items.map((item) => {
            return item.id;
        });
        const promise = await fetchSetsWithItems({
            collectionId: collectionItem.id,
            setIds: setIds,
        });
        console.log(promise);
        if (!promise) return;
        setPreviewCollectionItems(promise);
        showUsePreviewModal();
    };
    return (
        <div className={style.btnContainer}>
            <div onClick={handler}>
                <DefaultButton>
                    Preview
                    <HiMiniMagnifyingGlass />
                </DefaultButton>
            </div>
            <DefaultButton variant="Black">
                Study
                <HiArrowSmallRight />
            </DefaultButton>{" "}
        </div>
    );
}

export default CollectionItemBtn;
