"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import React from "react";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import style from "./collectionItem.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";

function CollectionItemBtn({
    collectionItem,
}: {
    collectionItem: Flashcard_collection_set_joined;
}) {
    const handler = async () => {
        const setIds = collectionItem.set_items.map((item) => {
            return item.id;
        });
        const promise = await fetchSetsWithItems({
            setIds: setIds,
        });
        console.log(promise);
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
