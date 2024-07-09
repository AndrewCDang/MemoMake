"use server";

import { db } from "../_lib/db";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "../_types/types";

export async function fetchCollectionByIdWithSetAndItemCount({
    userId,
    type,
}: {
    userId: string;
    type: "collection" | "set";
}) {
    try {
        if (type === "collection") {
            const fetch: Flashcard_collection_with_count[] = await db`
                SELECT fc.*, COUNT(DISTINCT  fs.id) AS set_count, COUNT(DISTINCT fi.id) as item_count
                FROM flashcard_collection fc
                LEFT JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
                WHERE fs.user_id = ${userId}
                GROUP BY fc.id;
            `;
            return fetch;
        } else if (type === "set") {
            const fetch: Flashcard_set_with_count[] = await db`
                SELECT fs.*, COUNT(DISTINCT fi.id) AS item_count
                FROM flashcard_set fs
                LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
                WHERE fs.user_id = ${userId}
                GROUP BY fs.id
            `;
            return fetch;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
}
