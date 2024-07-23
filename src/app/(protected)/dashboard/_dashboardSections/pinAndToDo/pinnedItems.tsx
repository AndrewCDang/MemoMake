"use client";
import React, { useState } from "react";
import style from "./pinAndToDo.module.scss";
import {
    Account,
    Flashcard_collection,
    Flashcard_set,
} from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { BannerIcon } from "@/app/_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import { HiChevronRight } from "react-icons/hi2";
import { IoMdThumbsUp } from "react-icons/io";
import Link from "next/link";
import LinkText from "@/app/_components/linkText/linkText";

type LikedPinnedItemsTypes = {
    itemsArray: {
        contentType: "collection" | "set";
        array: Flashcard_set[] | Flashcard_collection_set_joined[];
    }[];
    account: Account;
    title: string;
    type?: "like" | "pin";
};

function LikedPinnedItems({
    itemsArray,
    account,
    title,
    type = "pin",
}: LikedPinnedItemsTypes) {
    console.log(itemsArray);
    // Favourite state
    const [favouriteItems, setFavouriteItems] = useState<string[]>(
        account?.favourites || []
    );

    const favouriteHandler = (id: string) => {
        setFavouriteItems((prevState) => {
            if (prevState.includes(id)) {
                const removedArray = prevState.filter((item) => item !== id);
                return removedArray;
            } else {
                return [...prevState, id];
            }
        });
    };

    const PinIconComponent = ({
        id,
        hoverPos,
    }: {
        id: string;
        hoverPos: "top" | "left";
    }) => {
        return (
            <BannerIcon
                hoverText={favouriteItems.includes(id) ? "Unpin" : "Pin"}
                handler={() => favouriteHandler(id)}
                hoverPos={hoverPos}
            >
                <PinIcon
                    favourited={favouriteItems.includes(id)}
                    userId={account && account.user_id}
                    setId={id}
                    revalidate={false}
                />
            </BannerIcon>
        );
    };

    const LikeIconComponent = ({
        id,
        hoverPos,
    }: {
        id: string;
        hoverPos: "top" | "left";
    }) => {
        return (
            <BannerIcon
                hoverText="Liked"
                hoverPos={hoverPos}
                handler={() => null}
            >
                <IoMdThumbsUp />
            </BannerIcon>
        );
    };

    const setLength = itemsArray[0].array.length > 0;

    return (
        <section className={style.asideContainer}>
            <h6>{title}</h6>
            <div className={style.pinItemsContainerWrap}>
                <div
                    className={`${style.pinItemsContainer} ${style.pinMargin}`}
                >
                    {itemsArray &&
                        itemsArray.map((item) => {
                            if (item.contentType === "collection") {
                                const pinItem =
                                    item.array as Flashcard_collection[];
                                return pinItem.map((pinItem, index) => {
                                    return (
                                        <div
                                            className={style.pinItem}
                                            key={`pin_item-${pinItem.id}`}
                                        >
                                            <div className={style.leftSection}>
                                                {type === "pin" ? (
                                                    <PinIconComponent
                                                        hoverPos={
                                                            index === 0 &&
                                                            !setLength &&
                                                            item.array
                                                                ? "left"
                                                                : "top"
                                                        }
                                                        id={pinItem.id}
                                                    />
                                                ) : (
                                                    <LikeIconComponent
                                                        hoverPos={
                                                            index === 0 &&
                                                            !setLength
                                                                ? "left"
                                                                : "top"
                                                        }
                                                        id={pinItem.id}
                                                    />
                                                )}
                                                <span>
                                                    {pinItem.collection_name}
                                                </span>
                                            </div>
                                            <div className={style.rightSvg}>
                                                <HiChevronRight />
                                            </div>
                                        </div>
                                    );
                                });
                            } else if (item.contentType === "set") {
                                const pinItem = item.array as Flashcard_set[];
                                return pinItem.map((pinItem, index) => {
                                    return (
                                        <div
                                            className={style.pinItem}
                                            key={`pin_item-${pinItem.id}`}
                                        >
                                            <div className={style.leftSection}>
                                                {type === "pin" ? (
                                                    <PinIconComponent
                                                        hoverPos={
                                                            index === 0
                                                                ? "left"
                                                                : "top"
                                                        }
                                                        id={pinItem.id}
                                                    />
                                                ) : (
                                                    <LikeIconComponent
                                                        hoverPos={
                                                            index === 0
                                                                ? "left"
                                                                : "top"
                                                        }
                                                        id={pinItem.id}
                                                    />
                                                )}
                                                <span>{pinItem.set_name}</span>
                                            </div>
                                            <div className={style.rightSvg}>
                                                <HiChevronRight />
                                            </div>
                                            <Link
                                                className={style.clickWrap}
                                                href={`/dashboard/edit/${pinItem.id}`}
                                            ></Link>
                                        </div>
                                    );
                                });
                            }
                            return null;
                        })}
                    {type === "like" && (
                        <div className={style.linkLikedContainer}>
                            <LinkText
                                text="View all Liked Items"
                                link="/dashboard/likes"
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default LikedPinnedItems;
