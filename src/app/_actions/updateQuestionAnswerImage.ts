"use server";
import { db } from "../_lib/db";

type UpdateQuestionAnswerImageType = {
    id: string;
    type: "item_question" | "item_answer";
    image: string;
};
export const updateQuestionAnswerImageUrl = async ({
    id,
    type,
    image,
}: UpdateQuestionAnswerImageType) => {
    try {
        if (type === "item_question") {
            const updateUrl = await db`
                UPDATE flashcard_item
                SET question_img = ${image}
                WHERE id = ${id}
                RETURNING question_img
            `;

            return { message: "success", url: updateUrl };
        }
        if (type === "item_answer") {
            const updateUrl = await db`
                UPDATE flashcard_item
                SET answer_img = ${image}
                WHERE id = ${id}
                RETURNING answer_img
            `;
            return { message: "success", url: updateUrl };
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return { message: error, url: null };
    }
};
