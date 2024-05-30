"use client";
import { Flashcard_item, Flashcard_set_with_cards } from "@/app/_types/types";
import LoadingSpin from "../../svgs";
import TickValidate from "../../tickValidate/tickValidate";
import style from "../reviseCards.module.scss";

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
    return (
        <div className={style.questionsContainer}>
            <h5>Questions</h5>
            {/* Handles Modal via SET selection */}
            {selectedSets.length > 0 && filteredFlashItems.length > 0 ? (
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
