"use server";
import { revalidateTag } from "next/cache";
import { db } from "../_lib/db";

type UpdateQuestionAnswerImageType = {
    id: string;
    type: "item_question" | "item_answer";
    image: string;
    setId: string;
    imageId: string;
};
export const updateQuestionAnswerImageUrl = async ({
    id,
    type,
    image,
    imageId,
    setId,
}: UpdateQuestionAnswerImageType) => {
    try {
        if (type === "item_question") {
            const updateUrl = await db`
                UPDATE flashcard_item
                SET 
                    question_img = ${image},
                    question_img_id = ${imageId}
                WHERE id = ${id}
                RETURNING question_img
            `;
            const updatedImage =
                updateUrl[0]?.question_img || updateUrl[0]?.answer_img;
            revalidateTag(setId);

            return { message: "success", url: updatedImage };
        } else if (type === "item_answer") {
            const updateUrl = await db`
                UPDATE flashcard_item
                SET 
                    answer_img = ${image},
                    answer_img_id = ${imageId}
                WHERE id = ${id}
                RETURNING answer_img
            `;
            const updatedImage =
                updateUrl[0]?.question_img || updateUrl[0]?.answer_img;
            revalidateTag(setId);

            return { message: "success", url: updatedImage };
        } else {
            return { message: "Invalid type", url: null };
        }
    } catch (error) {
        console.error("Database update failed:", error);
        return { message: "error", url: null };
    }
};
