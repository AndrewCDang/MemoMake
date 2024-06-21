"use client";
import React, { useEffect } from "react";
import { FlashCardItem } from "../_dashboardItems/setItem/setItem";
import CollectionItem from "../_dashboardItems/collectionItem/collectionItem";

import {
    Account,
    Flashcard_collection_with_type,
    Flashcard_set,
    Flashcard_set_with_type,
} from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";

type RecentTypes = {
    recentItems: RecentItemsTypes | undefined;
    account: Account;
};

function RecentItems({ recentItems, account }: RecentTypes) {
    useEffect(() => {
        console.log(recentItems);
    }, [recentItems]);
    return (
        <section>
            {recentItems &&
                // Mapping all recent items
                recentItems.map((item, index) => {
                    // Returns 'Collection' Items
                    if (item.content_type === "collection") {
                        // Returns single collection
                        if (item.content.length < 1) return null;
                        if (item.content.length === 1) {
                            return (
                                <CollectionItem
                                    key={index}
                                    copy={true}
                                    collectionWithSets={
                                        item.content as Flashcard_collection_set_joined[]
                                    }
                                />
                            );
                            // Returns multiple collections
                        } else {
                            return (
                                <div key={index}>Collection of Collection</div>
                            );
                        }
                    }
                    // Returns 'Set' Items
                    else if (item.content_type === "set") {
                        if (item.content.length < 1) return null;
                        // Returns set collection
                        if (item.content.length === 1) {
                            const set = (item.content as Flashcard_set[])[0];
                            return (
                                <FlashCardItem
                                    key={index}
                                    set={set}
                                    index={index}
                                    account={account}
                                />
                            );
                        } else {
                            return <div key={index}>Collection of Sets</div>;
                        }
                    }
                })}
        </section>
    );
}

export default RecentItems;
