"use client";
import React, { use, useEffect, useState } from "react";
import style from "./pinAndToDo.module.scss";
import {
    Account,
    ContentType,
    Flashcard_collection,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { BannerIcon } from "@/app/_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import { HiChevronRight } from "react-icons/hi2";
import { IoMdThumbsUp } from "react-icons/io";
import Link from "next/link";
import { Fetched_like_array } from "../../../../api/fetch/fetchUserLikeItems/fetchUserLikeItems";
import { addRemoveLike } from "@/app/_actions/addRemoveLike";
import { colours } from "@/app/styles/colours";
import { fetched_pinned_items } from "@/app/_lib/fetch/fetchPinnedItems";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";

type LikedPinnedItemsTypes = {
    itemsArray:
        | (
              | Flashcard_collection
              | Flashcard_set
              | Flashcard_collection_set_joined
          )[]
        | Fetched_like_array;
    account: Account;
    title: string;
    type?: "like" | "pin";
    pinnedItems: fetched_pinned_items;
};

function LikedPinnedItems({
    itemsArray,
    account,
    title,
    type = "pin",
    pinnedItems,
}: LikedPinnedItemsTypes) {
    // Favourite state
    const [pinOrLikeItems, setPinOrLikeItems] = useState<string[]>(
        type === "pin"
            ? account?.favourites
            : type === "like"
            ? itemsArray.map((item) => item.id)
            : []
    );

    const favouriteHandler = (id: string) => {
        setPinOrLikeItems((prevState) => {
            if (prevState.includes(id)) {
                const removedArray = prevState.filter((item) => item !== id);
                return removedArray;
            } else {
                return [...prevState, id];
            }
        });
    };

    const likeHandler = async ({
        likeId,
        contentType,
    }: {
        likeId: string;
        contentType: ContentType;
    }) => {
        if (account) {
            const update = await addRemoveLike({
                id: account.user_id,
                setId: likeId,
                revalidate: false,
                contentType: contentType,
            });
        }
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
                hoverText={pinOrLikeItems.includes(id) ? "Unpin" : "Pin"}
                handler={() => favouriteHandler(id)}
                hoverPos={hoverPos}
            >
                <PinIcon
                    favourited={pinOrLikeItems.includes(id)}
                    userId={account && account.user_id}
                    setId={id}
                    revalidate={false}
                />{" "}
            </BannerIcon>
        );
    };

    const LikeIconComponent = ({
        id,
        hoverPos,
        contentType,
    }: {
        id: string;
        hoverPos: "top" | "left";
        contentType: ContentType;
    }) => {
        return (
            <BannerIcon
                hoverText={pinOrLikeItems.includes(id) ? "Unlike" : "Like"}
                hoverPos={hoverPos}
                handler={() => favouriteHandler(id)}
            >
                <IoMdThumbsUp
                    style={{
                        fill: pinOrLikeItems.includes(id)
                            ? colours.blueSelect()
                            : colours.grey(),
                    }}
                    onClick={() =>
                        likeHandler({ likeId: id, contentType: contentType })
                    }
                />
            </BannerIcon>
        );
    };

    const likeOrPinnedItems = type === "pin" ? pinnedItems : itemsArray;

    // Study Handler:
    // Study Handler | Modal
    const { setInitialCollectionItems, setInitalSet, showReviseModal } =
        useReviseModal();

    const studyHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { userId: set.user_id, id: id, type: contentType },
        });

        if (!promise) return;
        if (contentType === "set") {
            setInitalSet({ item: promise as Flashcard_set_with_cards[] });
        } else if (contentType === "collection") {
            setInitialCollectionItems({
                item: promise as Flashcard_collection_preview,
            });
        }

        showReviseModal();
    };

    return (
        <section className={style.asideContainer}>
            <div className={style.pinItemsContainerWrap}>
                <div
                    className={`${style.pinItemsContainer} ${style.pinMargin}`}
                >
                    {likeOrPinnedItems &&
                        likeOrPinnedItems.map((item, index) => {
                            const objectType =
                                "set_name" in item ? "set" : "collection";
                            return (
                                <div
                                    className={style.pinItem}
                                    key={`pin_item-${item.id}`}
                                >
                                    <div className={style.leftSection}>
                                        {type === "pin" ? (
                                            <PinIconComponent
                                                hoverPos={
                                                    index === 0 ? "left" : "top"
                                                }
                                                id={item.id}
                                            />
                                        ) : (
                                            <LikeIconComponent
                                                contentType={objectType}
                                                hoverPos={
                                                    index === 0 ? "left" : "top"
                                                }
                                                id={item.id}
                                            />
                                        )}
                                        {item.creator &&
                                            item.creator.image &&
                                            item.creator.id !==
                                                account.user_id && (
                                                <div>
                                                    <img
                                                        className={
                                                            style.creatorImg
                                                        }
                                                        src={item.creator.image}
                                                    ></img>
                                                </div>
                                            )}
                                        <span>
                                            {objectType === "set"
                                                ? (item as Flashcard_set)
                                                      .set_name
                                                : objectType === "collection"
                                                ? (item as Flashcard_collection)
                                                      .collection_name
                                                : ""}
                                        </span>
                                    </div>
                                    <div className={style.rightSvg}>
                                        <HiChevronRight />
                                    </div>
                                    {account.user_id === item.user_id ? (
                                        <Link
                                            className={style.clickWrap}
                                            href={`/dashboard/edit/${item.id}`}
                                        ></Link>
                                    ) : (
                                        <div
                                            className={style.clickWrap}
                                            onClick={() => alert("study")}
                                        ></div>
                                    )}
                                </div>
                            );
                        })}
                    {/* {type === "like" && (
                        <div className={style.linkLikedContainer}>
                            <LinkText
                                text="View all Liked Items"
                                link="/dashboard/likes"
                            />
                        </div>
                    )} */}
                </div>
            </div>
        </section>
    );
}

export default LikedPinnedItems;
