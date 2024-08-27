"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import style from "./setAndColelctionCard.module.scss";
import { AccountWithLikesAndPins, Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import CollectionSets from "./collectionComponents/collectionSetsV2";
import BannerStrip from "./generalComponents/bannerStrip/bannerStrip";
import { motion } from "framer-motion";
import { colours } from "@/app/styles/colours";
import BannerBtns from "./generalComponents/bannerBtns/bannerBtns";
import PreviewEditStudyBtns from "./generalComponents/previewEditStudyBtns/previewEditStudyBtns";

type SetAndCollectionCardTypes = {
    set: Flashcard_set | Flashcard_collection_set_joined;
    account: AccountWithLikesAndPins | undefined;
    contentType: "collection" | "set";
    publicPage?: boolean;
    setInitialContent: Dispatch<
        SetStateAction<Flashcard_collection_set_joined[] | Flashcard_set[]>
    >;
};

function SetAndCollectionCard({
    set,
    account,
    contentType,
    publicPage = false,
    setInitialContent,
}: SetAndCollectionCardTypes) {
    // Card not created by user
    const publicCard =
        (account && account.user_id !== set.user_id) ||
        (set.public_access && account === undefined)
            ? true
            : false;

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
            ? Array.isArray(account.user_likes) &&
                  account.user_likes.length > 0 &&
                  account.user_likes
                      .filter((item) => item !== null && item !== undefined)
                      .map((item) => item.item_id)
                      .includes(set.id)
            : false
    );

    // ThemeColour
    const themeColour = set.theme_colour
        ? colours[set.theme_colour]()
        : colours.lightGrey();

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

    // Deleteing State
    const [isDeleting, setIsDeleting] = useState<boolean>(false);

    return (
        <motion.article
            key={set.id}
            className={style.setContainer}
            animate={{ opacity: isDeleting ? 0.5 : 1 }}
        >
            <BannerStrip
                publicCard={publicCard}
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
                    setInitialContent={setInitialContent}
                    setIsDeleting={setIsDeleting}
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
                publicPage={publicPage}
            />
        </motion.article>
    );
}

export default SetAndCollectionCard;
