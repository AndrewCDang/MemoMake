"use client";
import React from "react";
import style from "../../existingSets.module.scss";
import CreateSetBtn from "../../_dashboardButtons/createSetBtn";
import {
    Account,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import FavouriteIcon from "@/app/_components/favouriteIcon/favouriteIcon";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";

export const FlashCardItem = ({
    set,
    account,
}: {
    set: Flashcard_set;
    index: number;
    account: Account;
}) => {
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const handler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { id: id, type: "set" },
        });
        console.log(id);
        console.log(promise);
        if (!promise) return;
        setPreviewCollectionItems({
            type: "set",
            content: promise as Flashcard_set_with_cards[],
        });
        showUsePreviewModal();
    };

    return (
        <article key={set.id} className={style.setContainer}>
            <div className={style.setContent}>
                <h4 className={style.title}>{set.set_name}</h4>
                <ul className={style.categoryContainer}>
                    {set.set_categories.map((category, index) => {
                        return <li key={index}>{category}</li>;
                    })}
                </ul>
                {set.description && <p>{set.description}</p>}
            </div>
            <div className={style.buttonContainer}>
                <DefaultButton handler={() => handler(set.id)}>
                    <span>Preview</span>
                    <HiMiniMagnifyingGlass />
                </DefaultButton>
                <DefaultButton variant="Black">
                    <span>Study</span>
                    <HiArrowSmallRight />
                </DefaultButton>
            </div>
            <div className={style.favouriteContainer}>
                <FavouriteIcon
                    favourited={
                        account !== undefined
                            ? account.favourites.includes(set.id)
                            : false
                    }
                    userId={account.user_id}
                    setId={set.id}
                />
            </div>
        </article>
    );
};

type SetItemTypes = {
    searchExistingSets: Flashcard_set[];
    account: Account;
};

function SetItem({ searchExistingSets, account }: SetItemTypes) {
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    return (
        <section>
            <div className={style.sectionTitle}>
                <h3>Flash Card Sets</h3>
                <div className={style.sectionBtnGroup}>
                    <CreateSetBtn />
                </div>
            </div>
            <section className={style.setGrid}>
                {searchExistingSets &&
                    searchExistingSets.map((set, index) => {
                        return (
                            <FlashCardItem
                                key={set.id}
                                set={set}
                                index={index}
                                account={account}
                            />
                        );
                    })}
            </section>
        </section>
    );
}

export default SetItem;
