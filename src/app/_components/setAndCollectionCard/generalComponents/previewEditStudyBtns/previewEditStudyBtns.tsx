import React from "react";
import style from "./previewEditStudyBtns.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiMiniSquaresPlus } from "react-icons/hi2";
import { LuFileCog } from "react-icons/lu";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { ContentType, Flashcard_set } from "@/app/_types/types";
import { usePreviewModal } from "@/app/_components/previewModal/usePreviewModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import Link from "next/link";
import StudyBtn from "./studyBtn/studyBtn";
import { useCreateSetModal } from "@/app/(protected)/dashboard/_dashboardModals/createSetModal/useCreateSetModal";
import { useCreateCollectionModal } from "@/app/(protected)/dashboard/_dashboardModals/createCollectionModal/useCreateCollection";

type PreviewEditStudyBtns = {
    publicCard: boolean;
    contentType: ContentType;
    set: Flashcard_set | Flashcard_collection_set_joined;
    isRecentTested?: boolean;
    publicPage: boolean;
};

function PreviewEditStudyBtns({
    publicCard,
    contentType,
    set,
    isRecentTested = false,
    publicPage,
}: PreviewEditStudyBtns) {
    // Preview Handler | Modal
    const { setPreviewCollectionItems, showUsePreviewModal } =
        usePreviewModal();

    const previewHandler = async (id: string) => {
        const promise = await fetchSetsWithItems({
            fetchObject: { userId: set.user_id, id: id, type: contentType },
        });
        if (!promise) return;
        setPreviewCollectionItems({
            type: contentType,
            content: promise,
        });
        showUsePreviewModal();
    };

    const { showEditCollectionModal } = useCreateCollectionModal();

    // Edit Btn Handler
    const editHandler = (id: string) => {
        if (contentType === "set") {
        }
    };

    return (
        <div className={style.buttonContainer}>
            {/* {isRecentTested ||
                (publicCard && (
                    <DefaultButton handler={() => previewHandler(set.id)}>
                        <span>Preview</span>
                        <HiMiniMagnifyingGlass />
                    </DefaultButton>
                ))} */}
            {!publicCard && contentType === "set" && (
                <Link href={`/dashboard/edit/${set.id}`}>
                    <DefaultButton>
                        <span>Edit</span>
                        <LuFileCog />
                    </DefaultButton>
                </Link>
            )}
            {!publicCard && contentType === "collection" && (
                <DefaultButton
                    handler={() =>
                        showEditCollectionModal(
                            set as Flashcard_collection_set_joined
                        )
                    }
                >
                    <span>Edit</span>
                    <HiMiniSquaresPlus />
                </DefaultButton>
            )}
            <StudyBtn set={set} contentType={contentType} />
            {publicPage && (
                <div className={style.sessionTestedText}>
                    <span>{`${set.session_count}`}</span> times tested
                </div>
            )}
        </div>
    );
}

export default PreviewEditStudyBtns;
