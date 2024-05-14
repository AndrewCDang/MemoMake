import React from "react";
import style from "./collectionItem.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";

import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { HiArrowSmallRight } from "react-icons/hi2";
import CollectionItemBtn from "./collectionItemBtn";

type CollectionItemTypes = {
    collectionWithSets: Flashcard_collection_set_joined[];
};

function CollectionItem({ collectionWithSets }: CollectionItemTypes) {
    return (
        <section className={style.collectionContainer}>
            <section className={style.setCollection}>
                {collectionWithSets.map((collectionItem, index) => {
                    return (
                        <section
                            key={collectionItem.id}
                            className={style.setCard}
                        >
                            <p className={style.setTitle}>
                                {collectionItem.collection_name}
                            </p>
                            <div className={style.setPacks}>
                                {collectionItem.set_items.length <= 3 ? (
                                    collectionItem.set_items.map((setItem) => {
                                        return (
                                            <div className={style.setName}>
                                                {setItem.set_name}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <>
                                        {collectionItem.set_items
                                            .slice(0, 2)
                                            .map((setItem) => {
                                                return (
                                                    <div
                                                        className={
                                                            style.setName
                                                        }
                                                    >
                                                        {setItem.set_name}
                                                    </div>
                                                );
                                            })}
                                        <div className={`${style.setName} ${style.moreSetsContainer}`}>
                                            <div>
                                            +
                                            {collectionItem.set_items.length -
                                                2}{" "}
                                            more sets

                                            </div>
                                            <div className={style.moreSetsEffect}></div>
                                            <div className={style.moreSetsEffect}></div>

                                        </div>
                                    </>
                                )}
                            </div>
                            <CollectionItemBtn
                                collectionItem={collectionItem}
                            />
                        </section>
                    );
                })}
            </section>
            <div className={style.btnContainer}>
                <DefaultButton>"Preview"</DefaultButton>
                <DefaultButton>"Study"</DefaultButton>
            </div>
        </section>
    );
}

export default CollectionItem;
