"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "../recentItems.module.scss";
import { RecentItemsTypes } from "../../_actions/fetchRecentTested";
import { Account, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import RecentItemsCard from "../recentComponents/recentItemsCard";
import { colours } from "@/app/styles/colours";
import LinkText from "@/app/_components/linkText/linkText";

type RecentItemsSectionTypes = {
    account: Account;
    recentItems:
        | RecentItemsTypes<Flashcard_set[] | Flashcard_collection_set_joined[]>
        | undefined;
};

function RecentItemsSection({ account, recentItems }: RecentItemsSectionTypes) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentImage, setCurrentImage] = useState<number>(0);

    const scrollRecentHandler = () => {
        if (scrollRef.current) {
            const currentScrollItem = Number(
                (
                    scrollRef.current.scrollLeft / scrollRef.current.offsetWidth
                ).toFixed(0)
            );
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
                func(...args);
            }
        };
    };

    const debouncedScrollHandler = useCallback(
        stagger(scrollRecentHandler, 25),
        []
    );

    useEffect(() => {
        if (typeof window !== "undefined" && scrollRef.current) {
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

    return (
        <div className={style.recentItemsWrap}>
            <h6>Recently Tested</h6>
            <div className={style.recentItemsContainer}>
                <div ref={scrollRef} className={style.flexRecentItems}>
                    {recentItems &&
                        recentItems.map((historyItem, index) => (
                            <div
                                key={index}
                                className={style.recentItemCardWrap}
                            >
                                <RecentItemsCard
                                    account={account}
                                    historyItem={historyItem}
                                />
                            </div>
                        ))}
                </div>
                <div className={style.orderDotsContainer}>
                    {recentItems &&
                        recentItems.map((item, index) => (
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
                        ))}
                </div>
                {/* <div className={style.linkContainer}>
                    <LinkText
                        link="/dashboard/history"
                        text="View all History"
                    ></LinkText>
                </div> */}
            </div>
        </div>
    );
}

export default RecentItemsSection;
