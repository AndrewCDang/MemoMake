"use client";
import style from "./recentItems.module.scss";
import { Account, Flashcard_set } from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import ToDoList, { Notes } from "./pinAndToDo/toDoList";
import { Session } from "next-auth";
import SideBarSection from "./sideBarSection/sideBarSection";
import RecentItemsSection from "./recentItemsSection/recentItemsSection";
import LikedPinnedItems from "./pinAndToDo/pinnedItems";
import { useRef } from "react";
import welcomeGif from "@/../../public/animations/flashmu_wave.gif";
import Image from "next/image";

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
};

function DashboardLanding({
    session,
    userNotes,
    recentItems,
    account,
    itemsArray,
}: RecentTypes) {
    console.log(session);

    const lottieRef = useRef<any>(null);

    return (
        <section className={style.setGrid}>
            <section className={style.dashboardBody}>
                <div className={style.welcomeSection}>
                    <div className={style.iconAndTitle}>
                        <h4>Welcome Back{session?.user?.name || ""}!</h4>
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
                <div className={style.recentAndLikedContainer}>
                    <ToDoList session={session} userNotes={userNotes} />

                    <RecentItemsSection recentItems={recentItems} />
                </div>
            </section>
            <section className={style.sideBarSection}>
                <SideBarSection />
            </section>
            <section className={style.pinnedTodoSection}>
                <div className={style.likedToDoWrap}>
                    <LikedPinnedItems
                        itemsArray={itemsArray}
                        account={account}
                        title="Pinned Items"
                    />
                    <LikedPinnedItems
                        itemsArray={itemsArray}
                        account={account}
                        title="Liked Items"
                        type="like"
                    />{" "}
                </div>
            </section>
        </section>
    );
}

export default DashboardLanding;
