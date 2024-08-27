"use client";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import style from "./recentItemsBtns.module.scss";
import React from "react";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import {
    Account,
    ContentType,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";

type RecentItemsBtnsTypes = {
    contentType: ContentType;
    id: string | string[];
    account: Account;
};

function RecentItemsBtns({ account, contentType, id }: RecentItemsBtnsTypes) {
    // Preview Handler | Modal
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const previewHandler = async (id: string | string[]) => {
        showUsePreviewModal();
        const promise = await fetchSetsWithItems({
            fetchObject: { userId: account.id, id, type: contentType },
        });
        if (!promise) return;
        setPreviewCollectionItems({
            type: contentType,
            content: promise,
        });
    };

    // Study Handler | Modal
    const { setInitialCollectionItems, setInitalSet, showReviseModal } =
        useReviseModal();

    const studyHandler = async (id: string | string[]) => {
        showReviseModal();

        const promise = await fetchSetsWithItems({
            fetchObject: { userId: account.id, id: id, type: contentType },
        });

        if (!promise) return;
        if (contentType === "set") {
            setInitalSet({ item: promise as Flashcard_set_with_cards[] });
        } else if (contentType === "collection") {
            setInitialCollectionItems({
                item: promise as
                    | Flashcard_collection_preview
                    | Flashcard_collection_preview[],
            });
        }
    };

    return (
        <div className={style.buttonContainer}>
            <DefaultButton handler={() => previewHandler(id)}>
                <span>Preview</span>
                <HiMiniMagnifyingGlass />
            </DefaultButton>

            <DefaultButton variant="Black" handler={() => studyHandler(id)}>
                <span>Study</span>
                <HiArrowSmallRight />
            </DefaultButton>
        </div>
    );
}

export default RecentItemsBtns;
