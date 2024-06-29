import React from "react";
import style from "./previewEditStudyBtns.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import { HiMiniSquaresPlus } from "react-icons/hi2";
import { LuFileCog } from "react-icons/lu";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import {
    ContentType,
    Flashcard_collection_preview,
    Flashcard_set,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import Link from "next/link";

type PreviewEditStudyBtns = {
    contentType: ContentType;
    set: Flashcard_set | Flashcard_collection_set_joined;
    isRecentTested?: boolean;
};

function PreviewEditStudyBtns({
    contentType,
    set,
    isRecentTested = false,
}: PreviewEditStudyBtns) {
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

    // Edit Btn Handler
    const editHandler = (id: string) => {
        if (contentType === "set") {
        }
    };

    return (
        <div className={style.buttonContainer}>
            {isRecentTested && (
                <DefaultButton handler={() => previewHandler(set.id)}>
                    <span>Preview</span>
                    <HiMiniMagnifyingGlass />
                </DefaultButton>
            )}
            {contentType === "set" ? (
                <Link href={`dashboard/edit/${set.id}`}>
                    <DefaultButton>
                        <span>Edit</span>
                        <LuFileCog />
                    </DefaultButton>
                </Link>
            ) : (
                <DefaultButton handler={() => editHandler(set.id)}>
                    <span>Edit</span>
                    <HiMiniSquaresPlus />
                </DefaultButton>
            )}
            <DefaultButton variant="Black" handler={() => studyHandler(set.id)}>
                <span>Study</span>
                <HiArrowSmallRight />
            </DefaultButton>
        </div>
    );
}

export default PreviewEditStudyBtns;
