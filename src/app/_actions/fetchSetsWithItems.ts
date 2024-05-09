"use server";
import { db } from "../_lib/db";
import { Flashcard_set, Flashcard_item } from "../_types/types";

export interface Flashcard_set_with_items extends Flashcard_set {
    flashcards: Flashcard_item[];
}

export const fetchSetsWithItems = async ({
    setIds,
}: {
    setIds: string[];
}): Promise<Flashcard_set_with_items[] | undefined> => {
    try {
        const setWithItems: Promise<Flashcard_set_with_items[]> = db`
        SELECT fs.*, array_agg(to_json(fi.*)) AS flashcards FROM flashcard_set fs
        LEFT JOIN flashcard_item fi ON fs.id = fi.set_id
        WHERE fs.id = ANY(${setIds})
        GROUP BY fs.id
        `;

        return setWithItems;
    } catch (error: unknown) {
        if (error instanceof Error)
            console.log({ status: 500, message: error.message });
    }
};
