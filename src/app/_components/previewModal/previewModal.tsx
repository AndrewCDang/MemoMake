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

const PreviewModal = () => {
    const { isUsePreviewModalOn, previewCollectionItems, hideUsePreviewModal } =
        usePreviewModal();

    const defaultToggle = previewCollectionItems
        ? previewCollectionItems.sets.reduce((acc, item) => {
              acc[item.id] = true;
              return acc;
          }, {} as ToggleType)
        : {};

    type ToggleType = {
        [key: string]: boolean;
    };
    const [toggledSets, setToggledSets] = useState<ToggleType>(defaultToggle);

    useEffect(() => {
        if (previewCollectionItems)
            setToggledSets(
                previewCollectionItems.sets.reduce((acc, item) => {
                    acc[item.id] = true;
                    return acc;
                }, {} as ToggleType)
            );
    }, [previewCollectionItems]);

    const Buttons = () => {
        return (
            <DefaultButton variant="Black">
                Study
                <HiArrowSmallRight />
            </DefaultButton>
        );
    };

    return (
        <Modal
            modalOn={isUsePreviewModalOn}
            closeHandler={() => hideUsePreviewModal()}
            modalTitle={
                previewCollectionItems
                    ? previewCollectionItems.collection_name
                    : "Preview"
            }
            footer={<Buttons />}
        >
            {previewCollectionItems && (
                <section className={style.setItemsContainer}>
                    {previewCollectionItems.sets.map((set) => {
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
                                                onTransitionEnd={() =>
                                                    console.log("yolo")
                                                }
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
