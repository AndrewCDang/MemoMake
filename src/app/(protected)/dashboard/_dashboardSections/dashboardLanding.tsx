"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./recentItems.module.scss";

import { Account, Flashcard_set } from "@/app/_types/types";
import { RecentItemsTypes } from "../_actions/fetchRecentTested";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import RecentItemsCard from "./recentComponents/recentItemsCard";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { colours } from "@/app/styles/colours";
import PinnedItems from "./pinAndToDo/pinnedItems";
import ToDoList, { Notes } from "./pinAndToDo/toDoList";
import { Session } from "next-auth";

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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentImage, setCurrentImage] = useState<number>(0);

    const scrollRecentHandler = () => {
        if (scrollRef.current) {
            const currentScrollItem = Number(
                (
                    scrollRef.current.scrollLeft / scrollRef.current.offsetWidth
                ).toFixed(0)
            );
            console.log("Current Scroll Item:", currentScrollItem);
            setCurrentImage((prevState) => {
                if (prevState !== currentScrollItem) {
                    return currentScrollItem;
                } else {
                    return prevState;
                }
            });
        }
    };

    const staggerRef = useRef<number>(0);

    const stagger = <T extends (...args: any[]) => void>(
        func: T,
        wait: number
    ): ((...args: Parameters<T>) => void) => {
        return (...args: Parameters<T>) => {
            staggerRef.current = staggerRef.current + 1;
            if (staggerRef.current % wait == 0) {
                console.log(staggerRef.current);
                func(...args);
            }
        };
    };

    const debouncedScrollHandler = useCallback(
        stagger(scrollRecentHandler, 25),
        []
    );

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.addEventListener(
                "scroll",
                debouncedScrollHandler
            );
            return () => {
                if (scrollRef.current) {
                    scrollRef.current.removeEventListener(
                        "scroll",
                        debouncedScrollHandler
                    );
                }
            };
        }
    }, [debouncedScrollHandler]);

    const scrollToItem = (card: number) => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                left: card * scrollRef.current.offsetWidth,
                behavior: "smooth",
            });
        }
    };

    console.log(session);

    return (
        <section className={style.setGrid}>
            <div className={style.iconAndTitle}>
                <HiArrowPathRoundedSquare />
                <h6>Welcome Back{session?.user?.name || ""}!</h6>
            </div>
            <section className={style.recentItemsContainer}>
                <div ref={scrollRef} className={style.flexRecentItems}>
                    {recentItems &&
                        // Mapping all recent items into RecentItemsCard
                        recentItems.map((historyItem, index) => {
                            return (
                                <div
                                    key={index}
                                    className={style.recentItemCardWrap}
                                >
                                    <RecentItemsCard
                                        historyItem={historyItem}
                                    />
                                </div>
                            );
                        })}
                </div>
                <div className={style.orderDotsContainer}>
                    {recentItems &&
                        recentItems.map((item, index) => {
                            return (
                                <div
                                    onClick={() => scrollToItem(index)}
                                    key={`dot-${index}`}
                                    className={style.imageDotOrderItem}
                                >
                                    <div
                                        style={{
                                            backgroundColor:
                                                index == currentImage
                                                    ? colours.black()
                                                    : colours.grey(),
                                        }}
                                    ></div>
                                </div>
                            );
                        })}
                </div>
            </section>
            <aside className={style.pinnedTodoSection}>
                <PinnedItems itemsArray={itemsArray} account={account} />
                <ToDoList session={session} userNotes={userNotes} />
            </aside>
        </section>
    );
}

export default DashboardLanding;
