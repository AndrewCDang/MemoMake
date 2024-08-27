"use client";
import style from "./recentItems.module.scss";
import { Account, Flashcard_set } from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { Notes } from "./pinAndToDo/toDoList";
import { Session } from "next-auth";
import SideBarSection from "./sideBarSection/sideBarSection";
import welcomeGif from "../../../../../public/animations/flashmu_wave.gif";
import Image from "next/image";
import RecentAndLikedContainer from "./recentAndLikedContainer";
import {
    Flashcard_collection_liked,
    Flashcard_set_liked,
} from "../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import { Fetched_pin_array } from "@/app/_lib/fetch/fetchPinnedItemsById";
import { Flashcard_set_with_random_item } from "./randomQuestion/fetchRandomQuestion";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import RandomQuestion from "./randomQuestion/randomQuestion";

type RecentTypes = {
    session: Session;
    userNotes: Notes[];
    recentItems:
        | RecentItemsTypes<Flashcard_collection_set_joined[] | Flashcard_set[]>
        | undefined;
    account: Account;
    likedItems: (Flashcard_collection_liked | Flashcard_set_liked)[];
    pinnedItems: Fetched_pin_array;
    randomQuestion: Flashcard_set_with_random_item | undefined;
};

function DashboardLanding({
    session,
    userNotes,
    recentItems,
    account,
    likedItems,
    pinnedItems,
    randomQuestion,
}: RecentTypes) {
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
                    <RandomQuestion
                        randomQuestion={randomQuestion}
                        account={account}
                    />
                </div>

                <RecentAndLikedContainer
                    session={session}
                    userNotes={userNotes}
                    recentItems={recentItems}
                    account={account}
                    likedItems={likedItems}
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
