"use client";
import React, { useState } from "react";
import style from "./setAndColelctionCard.module.scss";
import childStyle from "./generalComponents/bannerStrip/bannerStrip.module.scss";
import { AccountWithLikes, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import CollectionSets from "./collectionComponents/collectionSetsV2";
import BannerStrip from "./generalComponents/bannerStrip/bannerStrip";
import { motion } from "framer-motion";
import { colours } from "@/app/styles/colours";
import BannerBtns from "./generalComponents/bannerBtns/bannerBtns";
import PreviewEditStudyBtns from "./generalComponents/previewEditStudyBtns/previewEditStudyBtns";

type SetAndCollectionCardTypes = {
    set: Flashcard_set | Flashcard_collection_set_joined;
    account: AccountWithLikes | undefined;
    contentType: "collection" | "set";
    originalId?: string | null;
};

function SetAndCollectionCard({
    set,
    account,
    contentType,
    originalId = null,
}: SetAndCollectionCardTypes) {
    // Card not created by user
    const publicCard =
        account && account.user_id !== set.user_id ? true : false;

    // Card Content
    const getCardtitle = () => {
        switch (contentType) {
            case "collection":
                return (set as Flashcard_collection_set_joined).collection_name;
            case "set":
                return (set as Flashcard_set).set_name;
            default:
                return null;
        }
    };
    const cardTitle = getCardtitle();
    const cardCategories = set.set_categories || [];
    const cardDescription = set.description || null;

    // Favourite state
    const [isFavourited, setIsFavourited] = useState<boolean>(
        account !== undefined ? account.favourites.includes(set.id) : false
    );

    // Liked State
    const [isLiked, setIsliked] = useState<boolean>(
        account !== undefined
            ? account.user_likes.map((item) => item.item_id).includes(set.id)
            : false
    );

    // ThemeColour
    const themeColour = set.theme_colour
        ? colours[set.theme_colour]()
        : colours.grey();

    //
    //
    const TitleAndBody = () => {
        return (
            <div className={style.setContent}>
                <div className={style.titleContainer}>
                    <div
                        style={{
                            paddingTop: publicCard ? "0.5rem" : "0.75rem",
                        }}
                        className={style.titleImageContainer}
                    >
                        {set.image && (
                            <img
                                className={style.setImage}
                                src={set.image || "/defaultImg.jpg"}
                                alt={`$${contentType}-image`}
                            ></img>
                        )}
                        <h5 className={style.title}>{cardTitle}</h5>
                    </div>
                </div>
                {cardDescription && <p>{cardDescription}</p>}
            </div>
        );
    };

    return (
        <motion.article key={set.id} className={style.setContainer}>
            <BannerStrip
                setIsFavourited={setIsFavourited}
                setIsLiked={setIsliked}
                contentType={contentType}
                set={set}
                account={account}
                isFavourited={isFavourited}
                isLiked={isLiked}
                themeColour={themeColour}
            />
            <section
                style={{
                    top:
                        contentType === "set" && account?.id === set.id
                            ? "1.25rem"
                            : "0.5rem",
                }}
                className={style.bannerBtns}
            >
                <BannerBtns
                    publicCard={publicCard}
                    contentType={contentType}
                    setIsFavourited={setIsFavourited}
                    setIsLiked={setIsliked}
                    isLiked={isLiked}
                    isFavourited={isFavourited}
                    account={account}
                    set={set}
                />
            </section>
            <TitleAndBody />
            {/* Displaying Set items in collection card only */}
            {contentType === "collection" && (
                <CollectionSets
                    collectionItem={set as Flashcard_collection_set_joined}
                />
            )}
            <div className={style.buttonContainerHeight}></div>
            <PreviewEditStudyBtns
                publicCard={publicCard}
                contentType={contentType}
                set={set}
            />
        </motion.article>
    );
}

export default SetAndCollectionCard;
