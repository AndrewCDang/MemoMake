import React, { useEffect, useState } from "react";
import style from "./recentItems.module.scss";
import ToDoList, { Notes } from "./pinAndToDo/toDoList";
import { Session } from "@auth/core/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Account, Flashcard_set } from "@/app/_types/types";
import DashboardSubItems from "./dashboardSubItems/dashboardSubItems";
import {
    Fetched_like_array,
    Flashcard_collection_liked,
    Flashcard_set_liked,
} from "../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import { Fetched_pin_array } from "@/app/_lib/fetch/fetchPinnedItemsById";
import { Fetch_pin_objects } from "@/app/_lib/fetch/fetchPinnedItemsById";

function RecentAndLikedContainer({
    session,
    userNotes,
    recentItems,
    account,
    likedItems,
    pinnedItems,
}: {
    session: Session;
    userNotes: Notes[];
    recentItems:
        | RecentItemsTypes<Flashcard_collection_set_joined[] | Flashcard_set[]>
        | undefined;
    account: Account;
    likedItems: (Flashcard_collection_liked | Flashcard_set_liked)[];
    pinnedItems: Fetched_pin_array;
}) {
    return (
        <div className={style.recentAndLikedContainer}>
            <ToDoList session={session} userNotes={userNotes} />
            <DashboardSubItems
                account={account}
                recentItems={recentItems}
                likedItems={likedItems}
                pinnedItems={pinnedItems}
            />
        </div>
    );
}

export default RecentAndLikedContainer;
