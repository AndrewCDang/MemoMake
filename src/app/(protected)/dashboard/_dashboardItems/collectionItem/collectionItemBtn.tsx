"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import React from "react";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import style from "./collectionItem.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";

function CollectionItemBtn({
    collectionItem,
}: {
    collectionItem: Flashcard_collection_set_joined;
}) {
    const handler = () => {
        console.log(collectionItem.set_items);
        console.log("test...");
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
