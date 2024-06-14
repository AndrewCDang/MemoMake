"use client";
import { HiArrowSmallRight } from "react-icons/hi2";
import DefaultButton from "../(buttons)/defaultButton";
import Modal from "../modal/modal";
import style from "./previewModal.module.scss";
import { usePreviewModal } from "./usePreviewModal";
import { MdPlayArrow } from "react-icons/md";
import ExpandHeightToggler from "../expandHeightToggler/expandHeightToggler";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useReviseModal } from "../reviseCollection/useReviseModal";
import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";

const PreviewModal = () => {
    const { isUsePreviewModalOn, previewCollectionItems, hideUsePreviewModal } =
        usePreviewModal();

    const { showReviseModal, setInitialCollectionItems, setInitalSet } =
        useReviseModal();
    const getPreviewContent = () => {
        switch (previewCollectionItems.type) {
            case "collection":
                if (previewCollectionItems.content) {
                    return (
                        previewCollectionItems.content as Flashcard_collection_preview
                    ).sets;
                }
            case "set":
                return previewCollectionItems.content as Flashcard_set_with_cards[];

            default:
                return null;
        }
    };

    const previewContent = getPreviewContent();

    const defaultToggle = previewContent
        ? previewContent.reduce((acc, item) => {
              acc[item.id] = true;
              return acc;
          }, {} as ToggleType)
        : {};

    type ToggleType = {
        [key: string]: boolean;
    };
    const [toggledSets, setToggledSets] = useState<ToggleType>(defaultToggle);

    useEffect(() => {
        if (previewContent)
            setToggledSets(
                previewContent.reduce((acc, item) => {
                    acc[item.id] = true;
                    return acc;
                }, {} as ToggleType)
            );
    }, [previewCollectionItems]);

    const btnHandler = () => {
        showReviseModal();
        hideUsePreviewModal();
        if (previewCollectionItems) {
            if (
                previewCollectionItems.type === "collection" &&
                previewCollectionItems.content
            ) {
                setInitialCollectionItems({
                    item: previewCollectionItems.content as Flashcard_collection_preview,
                });
            } else if (
                previewCollectionItems.type === "set" &&
                previewCollectionItems.content
            ) {
                setInitalSet({
                    item: previewCollectionItems.content as Flashcard_set_with_cards[],
                });
            }
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
            return (
                previewCollectionItems.content as Flashcard_collection_preview
            ).collection_name;
        } else if (
            previewCollectionItems &&
            previewCollectionItems.type === "set"
        ) {
            return "Set Preview";
        }
    };

    return (
        <Modal
            modalOn={isUsePreviewModalOn}
            closeHandler={() => hideUsePreviewModal()}
            modalTitle={previewTitle() || "Preview"}
            footer={<Buttons />}
        >
            {previewContent && (
                <section className={style.setItemsContainer}>
                    {previewContent.map((set) => {
                        return (
                            <section
                                key={set.id}
                                className={style.flashSetContainer}
                            >
                                <div className={style.flashSetTitle}>
                                    <h6>{set.set_name}</h6>
                                    {set.flashcards &&
                                        set.flashcards.length > 0 && (
                                            <motion.button
                                                onClick={() =>
                                                    setToggledSets({
                                                        ...toggledSets,
                                                        [set.id]:
                                                            !toggledSets[
                                                                set.id
                                                            ],
                                                    })
                                                }
                                                animate={{
                                                    rotate: toggledSets[set.id]
                                                        ? 90
                                                        : 0,
                                                }}
                                            >
                                                <MdPlayArrow />
                                            </motion.button>
                                        )}
                                </div>
                                {set.flashcards && set.flashcards.length > 0 ? (
                                    <ExpandHeightToggler
                                        isOn={toggledSets[set.id]}
                                    >
                                        <section
                                            className={
                                                style.flashCardSetContainer
                                            }
                                        >
                                            <section
                                                className={
                                                    style.flashCardItemHeading
                                                }
                                            >
                                                <div>Question</div>
                                                <div>Answer</div>
                                            </section>
                                            {set.flashcards.map((card) => {
                                                return (
                                                    <section
                                                        key={card.id}
                                                        className={
                                                            style.flashCardItem
                                                        }
                                                    >
                                                        <div>
                                                            {card.item_question}
                                                        </div>
                                                        <div>
                                                            {card.item_answer}
                                                        </div>
                                                    </section>
                                                );
                                            })}
                                        </section>
                                    </ExpandHeightToggler>
                                ) : (
                                    <p>No flashcards made in this set yet</p>
                                )}
                            </section>
                        );
                    })}
                </section>
            )}
        </Modal>
    );
};

export default PreviewModal;
