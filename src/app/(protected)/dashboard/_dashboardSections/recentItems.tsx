"use client";
import React, { useEffect } from "react";
import style from "./recentItems.module.scss";

import { Account, Flashcard_set } from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import RecentItemsCard from "./recentComponents/recentItemsCard";

type RecentTypes = {
    recentItems:
        | RecentItemsTypes<Flashcard_collection_set_joined[] | Flashcard_set[]>
        | undefined;
    account: Account;
};

function RecentItems({ recentItems, account }: RecentTypes) {
    useEffect(() => {
        console.log(recentItems);
    }, [recentItems]);

    return (
        <section className={style.setGrid}>
            {recentItems &&
                // Mapping all recent items into RecentItemsCard
                recentItems.map((historyItem, index) => {
                    return (
                        <RecentItemsCard
                            key={index}
                            historyItem={historyItem}
                        />
                    );
                })}
        </section>
    );
}

export default RecentItems;
