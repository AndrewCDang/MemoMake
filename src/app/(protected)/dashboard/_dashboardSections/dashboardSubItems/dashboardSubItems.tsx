"use client";
import React, { useEffect, useState } from "react";
import style from "./dashbaordSubItems.module.scss";
import LikedPinnedItems from "../pinAndToDo/pinnedItems";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { RecentItemsTypes } from "../../_actions/fetchRecentTested";
import { Account, Flashcard_set } from "@/app/_types/types";
import RecentItemsSection from "../recentItemsSection/recentItemsSection";
import { Fetched_like_array } from "../../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import {
    ContentCarouselChild,
    ContentCarouselParent,
} from "@/app/_components/contentCarousel/contentCarousel";
import LoadingCircle from "@/app/_components/loadingUi/loadingCircle";
import {
    Fetch_pin_objects,
    Fetched_pin_array,
} from "@/app/_lib/fetch/fetchPinnedItemsById";

type SubDashboardType = "Pinned" | "Liked" | "History";
type DashboardSubItemsTypes = {
    recentItems:
        | RecentItemsTypes<Flashcard_collection_set_joined[] | Flashcard_set[]>
        | undefined;
    account: Account;
    likedItems: Fetched_like_array;
    pinnedItems: Fetched_pin_array;
};

function DashboardSubItems({
    account,
    recentItems,
    likedItems,
    pinnedItems,
}: DashboardSubItemsTypes) {
    const [windowLoaded, setWindowLoaded] = useState(false);

    useEffect(() => {
        setWindowLoaded(true);
    }, []);

    if (windowLoaded) {
        return (
            <section className={style.dashboardSubItemsContainer}>
                <div className={style.subItemContainer}>
                    <ContentCarouselParent btnType="allInLine">
                        <ContentCarouselChild pageName="pinned">
                            <LikedPinnedItems
                                account={account}
                                title="Liked Items"
                                type="pin"
                                pinnedItems={pinnedItems}
                                likedItems={likedItems}
                            />
                        </ContentCarouselChild>
                        <ContentCarouselChild pageName="liked">
                            <LikedPinnedItems
                                account={account}
                                title="like"
                                type="like"
                                pinnedItems={pinnedItems}
                                likedItems={likedItems}
                            />
                        </ContentCarouselChild>
                        <ContentCarouselChild pageName="history">
                            <RecentItemsSection
                                account={account}
                                recentItems={recentItems}
                            />
                        </ContentCarouselChild>
                    </ContentCarouselParent>
                </div>
            </section>
        );
    } else {
        return (
            <div className={style.loadingWrap}>
                <LoadingCircle variant="contain" />
            </div>
        );
    }
}

export default DashboardSubItems;
