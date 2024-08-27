"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import React from "react";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import style from "./collectionItem.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";

function CollectionItemBtn({
    collectionItem,
}: {
    collectionItem: Flashcard_collection_set_joined;
}) {
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const handler = async () => {
        showUsePreviewModal();
        const promise = await fetchSetsWithItems({
            fetchObject: {
                userId: collectionItem.user_id,
                id: collectionItem.id,
                type: "collection",
            },
        });
        if (!promise) return;
        setPreviewCollectionItems({ type: "collection", content: promise });
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
