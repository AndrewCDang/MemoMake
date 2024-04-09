"use server";
import { db } from "../_lib/db";

export const filterCollection = async (setId: string) => {
    try {
        const tags = await db`
        SELECT DISTINCT unnest(item_tags) AS tag
        FROM flashcard_item
        WHERE set_id = ${setId}
        `;

        return tags;
    } catch (error) {
        console.log(error);
    }
};
