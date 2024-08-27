"use client";
import React, { useEffect, useRef } from "react";
import style from "./collectionSetsV2.module.scss";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { useState } from "react";
import { colours } from "@/app/styles/colours";

type CollectionSetsTypes = {
    collectionItem: Flashcard_collection_set_joined;
};
function CollectionSets({ collectionItem }: CollectionSetsTypes) {
    const popOverRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    const [popOverStatus, setpopOverStatus] = useState<boolean>(false);

    const clickToggler = (e: MouseEvent) => {
        if (
            popOverStatus &&
            popOverRef.current &&
            cardRef.current &&
            e.target instanceof Node
        ) {
            if (
                !popOverRef.current.contains(e.target) &&
                !cardRef.current.contains(e.target)
            ) {
                setpopOverStatus(false);
            }
        }
    };

    useEffect(() => {
        if (popOverRef.current) {
            window.addEventListener("click", clickToggler);
            return () => {
                window.removeEventListener("click", clickToggler);
            };
        }
    }, [popOverStatus]);

    // Sorting sets by set name length
    const sortedSets =
        collectionItem.set_items && collectionItem.set_items.length > 1
            ? collectionItem.set_items.sort((a, b) => {
                  if (a.set_name.length < b.set_name.length) {
                      return -1;
                  } else if (a.set_name.length > b.set_name.length) {
                      return 1;
                  }
                  return 0;
              })
            : collectionItem.set_items;

    return (
        <section
            style={{
                backgroundColor: collectionItem.theme_colour
                    ? colours[collectionItem.theme_colour](0.1)
                    : colours.grey(0.1),
            }}
            className={style.collectionSetsContainer}
        >
            <span className={style.setLabel}>Sets inside</span>
            <div className={style.setsCollection}>
                {sortedSets &&
                    sortedSets.map((item) => {
                        if (item) {
                            return (
                                <div className={style.setItem} key={item.id}>
                                    <span>{item.set_name}</span>
                                    <div
                                        style={{
                                            backgroundColor:
                                                item.theme_colour !== null
                                                    ? colours[
                                                          item.theme_colour
                                                      ]()
                                                    : colours.lightGrey(),
                                        }}
                                        className={style.setItemBg}
                                    ></div>
                                </div>
                            );
                        }
                    })}
            </div>
        </section>
    );
}

export default CollectionSets;
