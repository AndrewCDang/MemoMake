"use client";
import style from "./recentItems.module.scss";
import { Account, Flashcard_set } from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { Notes } from "./pinAndToDo/toDoList";
import { Session } from "next-auth";
import SideBarSection from "./sideBarSection/sideBarSection";
import welcomeGif from "@/../../public/animations/flashmu_wave.gif";
import Image from "next/image";
import RecentAndLikedContainer from "./recentAndLikedContainer";
import { Fetch_like_objects } from "../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import { fetched_pinned_items } from "@/app/_lib/fetch/fetchPinnedItems";

type RecentTypes = {
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
    likedItems: Fetch_like_objects[];
    pinnedItems: fetched_pinned_items;
};

function DashboardLanding({
    session,
    userNotes,
    recentItems,
    account,
    itemsArray,
    likedItems,
    pinnedItems,
}: RecentTypes) {
    console.log(account);

    const reducedLikes = Object.values(likedItems[0])
        .flat()
        .filter((item) => item !== null)
        .sort(
            (a, b) =>
                new Date(b.created).getTime() - new Date(a.created).getTime()
        );

    return (
        <section className={style.setGrid}>
            <section className={style.dashboardBody}>
                <div className={style.welcomeSection}>
                    <div className={style.iconAndTitle}>
                        <div className={style.nameAndImageContainer}>
                            {account.image && (
                                <img
                                    className={style.dashboardUserImage}
                                    src={account.image}
                                    alt=""
                                ></img>
                            )}
                            <h4>{account.user_name || ""} Dashboard</h4>
                        </div>
                        <div className={style.welcomeGifContainer}>
                            <Image
                                src={welcomeGif}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                alt="art image"
                            ></Image>
                        </div>
                    </div>
                    <div className={style.randomQuestion}>
                        <div>
                            <h6>Random Question of the day</h6>
                        </div>
                    </div>
                </div>
                <RecentAndLikedContainer
                    session={session}
                    userNotes={userNotes}
                    recentItems={recentItems}
                    account={account}
                    itemsArray={itemsArray}
                    likedItems={reducedLikes}
                    pinnedItems={pinnedItems}
                />
            </section>
            <section className={style.sideBarSection}>
                <SideBarSection />
            </section>
        </section>
    );
}

export default DashboardLanding;
