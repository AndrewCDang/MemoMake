"use client";
import { HiArrowSmallRight } from "react-icons/hi2";
import DefaultButton from "../(buttons)/defaultButton";
import Modal from "../modal/modal";
import style from "./previewModal.module.scss";
import { usePreviewModal } from "./usePreviewModal";
import { useReviseModal } from "../reviseCollection/useReviseModal";
import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { setRevisionModal } from "./_hooks/setRevisionModal";
import PreviewModalSet from "./previewModalSet";
import { CollectionIcon } from "../svgs/svgs";
import LoadingCircle from "../loadingUi/loadingCircle";

const PreviewModal = () => {
    const {
        isUsePreviewModalOn,
        previewCollectionItems,
        hideUsePreviewModal,
        resetPreviewModal,
    } = usePreviewModal();

    const { showReviseModal, setInitialCollectionItems, setInitalSet } =
        useReviseModal();

    const getPreviewContent = () => {
        switch (previewCollectionItems.type) {
            case "collection":
                if (previewCollectionItems.content) {
                    if (!Array.isArray(previewCollectionItems.content)) {
                        return (
                            previewCollectionItems.content as Flashcard_collection_preview
                        ).sets;
                    } else
                        return previewCollectionItems.content as Flashcard_collection_preview[];
                }
            case "set":
                return previewCollectionItems.content as Flashcard_set_with_cards[];

            default:
                return null;
        }
    };

    const previewContent = getPreviewContent();

    const btnHandler = () => {
        showReviseModal();
        hideUsePreviewModal();
        setRevisionModal({
            previewCollectionItems,
            setInitialCollectionItems,
            setInitalSet,
        });
    };

    const studyHandler = async () => {
        showReviseModal();

        if (previewCollectionItems.type === "set") {
            setInitalSet({
                item: previewContent as Flashcard_set_with_cards[],
            });
        } else if (previewCollectionItems.type === "collection") {
            setInitialCollectionItems({
                item: previewContent as
                    | Flashcard_collection_preview
                    | Flashcard_collection_preview[],
            });
        }
    };

    const Buttons = () => {
        return (
            <DefaultButton variant="Black" handler={btnHandler}>
                Study
                <HiArrowSmallRight />
            </DefaultButton>
        );
    };

    const previewTitle = () => {
        if (
            previewCollectionItems &&
            previewCollectionItems.type === "collection"
        ) {
            if (
                previewCollectionItems.content &&
                !Array.isArray(previewCollectionItems.content)
            )
                return (
                    previewCollectionItems.content as Flashcard_collection_preview
                ).collection_name;
            else {
                return "Collection Group";
            }
        } else if (
            previewCollectionItems &&
            previewCollectionItems.type === "set"
        ) {
            return "Set Preview";
        }
    };

    const isFlashSet = (
        obj: Flashcard_collection_preview | Flashcard_set_with_cards
    ) => {
        return obj && "set_name" in obj;
    };

    const typeCheck = () => {
        if (previewContent && previewContent.every(isFlashSet)) {
            return true;
        } else return false;
    };

    const ischeck = previewContent && typeCheck();

    return (
        <Modal
            modalOn={isUsePreviewModalOn}
            closeHandler={() => (hideUsePreviewModal(), resetPreviewModal())}
            modalTitle={previewTitle() || "Preview"}
            footer={<Buttons />}
            widthFit="wide"
        >
            {ischeck ? (
                <PreviewModalSet
                    previewContent={
                        previewContent as Flashcard_set_with_cards[]
                    }
                />
            ) : previewContent !== null ? (
                (previewContent as Flashcard_collection_preview[]).map(
                    (item) => {
                        return (
                            <section
                                key={item.id}
                                className={style.collectionGroup}
                            >
                                {/* THEMECOLOURSTRIP */}
                                <div className={style.collectionGroupTitle}>
                                    <CollectionIcon />
                                    <h6>{item.collection_name}</h6>
                                </div>
                                <PreviewModalSet previewContent={item.sets} />
                            </section>
                        );
                    }
                )
            ) : (
                <div className={style.loadingWrap}>
                    <LoadingCircle variant="contain" />
                </div>
            )}
        </Modal>
    );
};

export default PreviewModal;
