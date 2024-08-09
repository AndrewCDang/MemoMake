import { db } from "../db";
import { Flashcard_set_with_count } from "../../_types/types";

type FetchCollectionSetCount = {
    userId: string;
    setNotEmpty?: boolean;
};

export async function fetchCollectionSetCount({
    userId,
    setNotEmpty = true,
}: FetchCollectionSetCount): Promise<Flashcard_set_with_count[] | undefined> {
    try {
        if (setNotEmpty) {
            const fetch: Flashcard_set_with_count[] = await db`
            SELECT fs.*, COUNT(fi.id) as item_count
            FROM flashcard_set fs
            LEFT JOIN flashcard_item fi ON fs.id = fi.set_id
            WHERE fs.user_id = ${userId}
            GROUP BY fs.id
            `;
            return fetch;
        } else {
            const fetch: Flashcard_set_with_count[] = await db`
            SELECT fs.*, COUNT(fi.id) as item_count
            FROM flashcard_item fi
            LEFT JOIN flashcard_set fs ON fi.set_id = fs.id
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
