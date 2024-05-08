"use server";
import { db } from "../_lib/db";
import { Flashcard_collection } from "../_types/types";

export const fetchCollectionById = async ({
    id,
}: {
    id: string;
}): Promise<Flashcard_collection[] | undefined> => {
    try {
        const collection: Flashcard_collection[] = await db`
        SELECT * FROM flashcard_collection
        WHERE user_id = ${id}
        `;

        return collection;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
