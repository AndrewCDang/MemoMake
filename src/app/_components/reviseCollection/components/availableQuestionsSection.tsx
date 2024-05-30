"use client"
import LoadingSpin from "../../svgs";
import TickValidate from "../../tickValidate/tickValidate";
import style from "../reviseCards.module.scss";

type AvaialableQuestionsTypes = {
    
}

const AvailableQuestionSection = () => {
    return(
        <div className={style.questionsContainer}>
        <h5>Questions</h5>
        {/* {selectedSets.length > 0 && filteredFlashItems.length > 0 ? (
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
        )} */}
    </div>
    )
}


export default AvailableQuestionSection