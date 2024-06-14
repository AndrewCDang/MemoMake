"use server";
import { db } from "../_lib/db";
import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "../_types/types";

export const fetchSetsWithItems = async ({
    fetchObject,
}: {
    fetchObject: { id: string; type: "collection" | "set" };
}): Promise<
    Flashcard_collection_preview | Flashcard_set_with_cards[] | undefined
> => {
    try {
        if (fetchObject.type === "collection") {
            const result: Flashcard_collection_preview[] = await db`
            SELECT 
                fc.*,
                (
                    SELECT json_agg(flash_set_data)
                    FROM (
                        SELECT 
                            fs.*,
                            (
                                SELECT json_agg(flash_item_data)
                                FROM (
                                    SELECT fi.*
                                    FROM flashcard_item fi
                                    WHERE fi.set_id = fs.id
                                ) as flash_item_data
                            ) as flashcards
                        FROM flashcard_set fs
                        WHERE fs.id = ANY(fc.ids)
                    ) as flash_set_data
                ) as sets
            FROM flashcard_collection fc
            WHERE fc.id = ${fetchObject.id}
            `;
            const setWithItems = result[0];

            return setWithItems;
        } else if (fetchObject.type === "set") {
            const fetchSet: Flashcard_set_with_cards[] = await db`
            SELECT fs.*, array_agg(to_json(fi.*)) AS flashcards FROM flashcard_set fs
            LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
            WHERE fs.id = ${fetchObject.id}
            GROUP BY fs.id
            `;
            return fetchSet;
        }
    } catch (error: unknown) {
        if (error instanceof Error)
            console.log({ status: 500, message: error.message });
    }
};
