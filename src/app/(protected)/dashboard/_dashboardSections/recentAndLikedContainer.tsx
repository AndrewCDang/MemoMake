import React, { useEffect, useState } from "react";
import style from "./recentItems.module.scss";
import ToDoList, { Notes } from "./pinAndToDo/toDoList";
import { Session } from "@auth/core/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Account, Flashcard_set } from "@/app/_types/types";
import DashboardSubItems from "./dashboardSubItems/dashboardSubItems";
import { Fetched_like_array } from "../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import { fetched_pinned_items } from "@/app/_lib/fetch/fetchPinnedItems";

function RecentAndLikedContainer({
    session,
    userNotes,
    recentItems,
    account,
    itemsArray,
    likedItems,
    pinnedItems,
}: {
    session: Session;
    userNotes: Notes[];
    recentItems:
        | RecentItemsTypes<Flashcard_collection_set_joined[] | Flashcard_set[]>
        | undefined;
    account: Account;
    itemsArray: {
        contentType: "collection" | "set";
        array: Flashcard_set[] | Flashcard_collection_set_joined[];
    }[];
    likedItems: Fetched_like_array;
    pinnedItems: fetched_pinned_items;
}) {
    return (
        <div className={style.recentAndLikedContainer}>
            <ToDoList session={session} userNotes={userNotes} />
            <DashboardSubItems
                itemsArray={itemsArray}
                account={account}
                recentItems={recentItems}
                likedItems={likedItems}
                pinnedItems={pinnedItems}
            />
        </div>
    );
}

export default RecentAndLikedContainer;
