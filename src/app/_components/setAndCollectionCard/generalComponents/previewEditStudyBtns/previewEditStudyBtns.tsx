import React from "react";
import style from "./previewEditStudyBtns.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiArrowSmallRight, HiMiniMagnifyingGlass } from "react-icons/hi2";
import { HiMiniSquaresPlus } from "react-icons/hi2";
import { LuFileCog } from "react-icons/lu";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { ContentType, Flashcard_set } from "@/app/_types/types";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_actions/fetchSetsWithItems";
import Link from "next/link";
import StudyBtn from "./studyBtn/studyBtn";

type PreviewEditStudyBtns = {
    publicCard: boolean;
    contentType: ContentType;
    set: Flashcard_set | Flashcard_collection_set_joined;
    isRecentTested?: boolean;
};

function PreviewEditStudyBtns({
    publicCard,
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

    // Edit Btn Handler
    const editHandler = (id: string) => {
        if (contentType === "set") {
        }
    };

    console.log(publicCard);
    return (
        <div className={style.buttonContainer}>
            {isRecentTested ||
                (publicCard && (
                    <DefaultButton handler={() => previewHandler(set.id)}>
                        <span>Preview</span>
                        <HiMiniMagnifyingGlass />
                    </DefaultButton>
                ))}
            {!publicCard && contentType === "set" && (
                <Link href={`dashboard/edit/${set.id}`}>
                    <DefaultButton>
                        <span>Edit</span>
                        <LuFileCog />
                    </DefaultButton>
                </Link>
            )}
            {!publicCard && contentType === "collection" && (
                <DefaultButton handler={() => editHandler(set.id)}>
                    <span>Edit</span>
                    <HiMiniSquaresPlus />
                </DefaultButton>
            )}
            <StudyBtn set={set} contentType={contentType} />
        </div>
    );
}

export default PreviewEditStudyBtns;
