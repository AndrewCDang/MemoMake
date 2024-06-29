"use client";
import { Flashcard_item, Flashcard_set_with_cards } from "@/app/_types/types";
import LoadingSpin from "../../svgs";
import TickValidate from "../../tickValidate/tickValidate";
import style from "../reviseCards.module.scss";
import { useEffect } from "react";
import { useReviseModal } from "../useReviseModal";

type AvaialableQuestionsTypes = {
    selectedSets: Flashcard_set_with_cards[];
    filteredFlashItems: Flashcard_item[];
    allTags: boolean;
    allDiff: boolean;
    fetchLoading: boolean;
};

const AvailableQuestionSection = ({
    selectedSets,
    filteredFlashItems,
    allTags,
    allDiff,
    fetchLoading,
}: AvaialableQuestionsTypes) => {
    const {
        initialCollectionItems,
        setInitialCollectionItems,
        isReviseModalOn,
        hideReviseModal,
        initialSetItems,
        setInitalSet,
        reviseModalType,
    } = useReviseModal();

    const totalCards = () => {
        if (reviseModalType === "collection") {
            const cardNum = initialCollectionItems
                .flatMap((item) =>
                    item.sets.flatMap((item) =>
                        item.flashcards ? item.flashcards.length : 0
                    )
                )
                .reduce((acc, curr) => acc + curr, 0);
            return cardNum - filteredFlashItems.length;
        } else if (reviseModalType === "set") {
            const cardNum = initialSetItems
                .flatMap((item) =>
                    item.flashcards ? item.flashcards.length : 0
                )
                .reduce((acc, curr) => acc + curr, 0);
            return cardNum - filteredFlashItems.length;
        }
        return 0;
    };

    return (
        <div className={style.questionsContainer}>
            <h5>Questions</h5>
            {/* Handles Modal via SET selection */}
            {filteredFlashItems.length > 0 ? (
                <>
                    <div className={style.defaultHeadingOption}>
                        <div>
                            Revise
                            {allTags && allDiff ? " all " : " "}
                            {fetchLoading ? (
                                <div className={style.loadingSpinQuestion}>
                                    <LoadingSpin />
                                </div>
                            ) : (
                                filteredFlashItems.length + " "
                            )}
                            questions
                        </div>
                        <TickValidate condition={true} />
                    </div>
                    {totalCards() > 0 && (
                        <span className={style.note}>
                            (Removed {totalCards()} overlapping questions)
                        </span>
                    )}
                </>
            ) : (
                <>
                    <span className={style.stateCheckValidation}>
                        No questions or set available
                        <TickValidate condition={false} />
                    </span>
                </>
            )}
            {/* Handles Modal via COLLECTION selection */}
        </div>
    );
};

export default AvailableQuestionSection;
