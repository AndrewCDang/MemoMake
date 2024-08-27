import React from "react";
import style from "./randomQuestion.module.scss";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import {
    Account,
    ContentType,
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "@/app/_types/types";
import { Flashcard_set_with_random_item } from "./fetchRandomQuestion";

function RandomQuestion({
    randomQuestion,
    account,
}: {
    randomQuestion: Flashcard_set_with_random_item | undefined;
    account: Account;
}) {
    const { setInitialCollectionItems, setInitalSet, showReviseModal } =
        useReviseModal();

    const studyHandler = async (id: string, contentType: ContentType) => {
        showReviseModal();
        const promise = await fetchSetsWithItems({
            fetchObject: {
                userId: account.user_id,
                id: id,
                type: contentType,
            },
        });
        if (!promise) return;
        if (contentType === "set") {
            setInitalSet({ item: promise as Flashcard_set_with_cards[] });
        } else if (contentType === "collection") {
            setInitialCollectionItems({
                item: promise as Flashcard_collection_preview,
            });
        }
    };
    return (
        <>
            {randomQuestion && (
                <div
                    onClick={() => studyHandler(randomQuestion.id, "set")}
                    className={style.randomQuestionFlip}
                >
                    <div
                        className={`${style.randomQuestion} ${style.questionSide}`}
                    >
                        <div className={style.randomTitleLabel}>
                            <p>Random Question</p>
                        </div>

                        <h6 className={style.randomQuestionText}>
                            &apos;{randomQuestion.item_question}&apos;?
                        </h6>
                    </div>
                    <div
                        className={`${style.randomQuestion} ${style.answerSide}`}
                    >
                        <div className={style.randomTitleLabel}>
                            <p>Answer</p>
                        </div>

                        <h6 className={style.randomQuestionText}>
                            &apos;{randomQuestion.item_answer}&apos;
                        </h6>
                    </div>
                </div>
            )}
        </>
    );
}

export default RandomQuestion;
