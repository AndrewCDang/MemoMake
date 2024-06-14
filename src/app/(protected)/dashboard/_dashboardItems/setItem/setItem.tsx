"use client";
import React from "react";
import style from "../../existingSets.module.scss";
import CreateSetBtn from "../../_dashboardButtons/createSetBtn";
import {
    Account,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { HiArrowRightCircle } from "react-icons/hi2";
import Link from "next/link";
import FavouriteIcon from "@/app/_components/favouriteIcon/favouriteIcon";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";

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
        <section key={set.id} className={style.setContainer}>
            <div className={style.setContent}>
                <h4>{set.set_name}</h4>
                <div className={style.categoryContainer}>
                    {set.set_categories.map((category, index) => {
                        return <label key={index}>{category}</label>;
                    })}
                </div>
                {set.description && <p>{set.description}</p>}
            </div>
            <button onClick={() => handler(set.id)} className={style.viewSet}>
                <p>Preview</p>
                <HiArrowRightCircle />
            </button>
            <div className={style.viewSet}>
                <p>Study</p>
                <HiArrowRightCircle />
            </div>
            <Link href={`dashboard/flashcard?id=${set.id}`}>
                <div className={style.viewSet}>
                    <p>Edit Set</p>
                    <HiArrowRightCircle />
                </div>
            </Link>
            <div>
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
        </section>
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
