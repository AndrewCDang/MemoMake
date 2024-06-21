"use client";
import React, { useState } from "react";
import style from "./setAndColelctionCard.module.scss";
import {
    Account,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import DefaultButton from "../(buttons)/defaultButton";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import FavouriteIcon from "../favouriteIcon/favouriteIcon";
import { AiFillPushpin } from "react-icons/ai";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import { usePreviewModal } from "../previewModal/usePreviewModal";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { useReviseModal } from "../reviseCollection/useReviseModal";
import CollectionSets from "./collectionComponents/collectionSets";
import BannerStrip from "./generalComponents/bannerStrip/bannerStrip";
import PinIcon from "../_generalUi/pinIcon/pinIcon";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { BiBorderRadius } from "react-icons/bi";
import { colours } from "@/app/styles/colours";
import BannerBtns from "./generalComponents/bannerBtns/bannerBtns";

type SetAndCollectionCardTypes = {
    set: Flashcard_set | Flashcard_collection_set_joined;
    account: Account;
    contentType: "collection" | "set";
    originalId?: string | null;
};

function SetAndCollectionCard({
    set,
    account,
    contentType,
    originalId = null,
}: SetAndCollectionCardTypes) {
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

    // Preview Handler | Modal
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const previewHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { id: id, type: contentType },
        });
        if (!promise) return;
        setPreviewCollectionItems({
            type: contentType,
            content: promise,
        });
        showUsePreviewModal();
    };

    // Study Handler | Modal
    const { setInitialCollectionItems, setInitalSet, showReviseModal } =
        useReviseModal();

    const studyHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { id: id, type: contentType },
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

    // Favourite state
    const [isFavourited, setIsFavourited] = useState<boolean>(
        account !== undefined ? account.favourites.includes(set.id) : false
    );

    // ThemeColour
    const themeColour = set.theme_colour
        ? colours[set.theme_colour]()
        : colours.grey();

    return (
        <motion.article key={set.id} className={style.setContainer}>
            <BannerStrip
                contentType={contentType}
                set={set}
                account={account}
                isFavourited={isFavourited}
                themeColour={themeColour}
            />
            <section className={style.bannerBtns}>
                <BannerBtns
                    setIsFavourited={setIsFavourited}
                    isFavourited={isFavourited}
                    account={account}
                    set={set}
                />
            </section>
            <div className={style.setContent}>
                <div className={style.titleContainer}>
                    <div className={style.titleImageContainer}>
                        {!set.image && (
                            <img
                                className={style.setImage}
                                src={set.image || "/defaultImg.jpg"}
                                alt={`$${contentType}-image`}
                            ></img>
                        )}
                        <h5 className={style.title}>{cardTitle}</h5>
                    </div>
                </div>
                <ul className={style.categoryContainer}>
                    {cardCategories.map((category, index) => {
                        return <li key={index}>{category}</li>;
                    })}
                </ul>
                {cardDescription && <p>{cardDescription}</p>}
            </div>
            {contentType === "collection" && (
                <CollectionSets
                    collectionItem={set as Flashcard_collection_set_joined}
                />
            )}
            <div className={style.buttonContainerHeight}></div>
            <div className={style.buttonContainer}>
                <DefaultButton handler={() => previewHandler(set.id)}>
                    <span>Preview</span>
                    <HiMiniMagnifyingGlass />
                </DefaultButton>
                <DefaultButton
                    variant="Black"
                    handler={() => studyHandler(set.id)}
                >
                    <span>Study</span>
                    <HiArrowSmallRight />
                </DefaultButton>
            </div>
        </motion.article>
    );
}

export default SetAndCollectionCard;
