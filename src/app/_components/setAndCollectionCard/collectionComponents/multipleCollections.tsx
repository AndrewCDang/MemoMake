"use client";
import React from "react";
import style from "./collectionSetsV2.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { colours } from "@/app/styles/colours";
import { ContentType, Flashcard_set } from "@/app/_types/types";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";

type CollectionSetsTypes = {
    collectionItem: Flashcard_set[] | Flashcard_collection_set_joined[];
    contentType: ContentType;
};
function MultipleCollections({
    collectionItem,
    contentType,
}: CollectionSetsTypes) {
    // Getting Name of set or collection
    const getName = (item: Flashcard_set | Flashcard_collection_set_joined) => {
        if ("collection_name" in item) {
            return item.collection_name;
        } else if ("set_name" in item) {
            return item.set_name;
        }
        return "";
    };

    // Sorting sets by set name length
    const sortedSets = collectionItem.sort((a, b) => {
        if (getName(a).length < getName(b).length) {
            return -1;
        } else if (getName(a).length > getName(b).length) {
            return 1;
        }
        return 0;
    });

    return (
        <section
            style={{
                backgroundColor: colours.grey(0.1),
            }}
            className={style.collectionSetsContainer}
        >
            <span className={style.setLabel}>
                {capitaliseFirstChar(contentType)} inside
            </span>
            <div className={style.setsCollection}>
                {sortedSets.map((item) => {
                    return (
                        <div className={style.setItem} key={item.id}>
                            <span>{capitaliseFirstChar(getName(item))}</span>
                            <div
                                style={{
                                    backgroundColor:
                                        item.theme_colour !== null
                                            ? colours[item.theme_colour]()
                                            : colours.lightGrey(),
                                }}
                                className={style.setItemBg}
                            ></div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default MultipleCollections;
