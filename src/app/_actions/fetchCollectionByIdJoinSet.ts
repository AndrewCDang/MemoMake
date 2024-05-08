"use server";
import { db } from "../_lib/db";
import { Flashcard_collection, Flashcard_set } from "../_types/types";

export interface Flashcard_collection_set_joined extends Flashcard_collection {
    set_items: Flashcard_set[];
}

export const fetchCollectionByIdJoinSet = async ({
    id,
}: {
    id: string;
}): Promise<Flashcard_collection_set_joined[] | undefined> => {
    try {
        const collection: Flashcard_collection_set_joined[] = await db`
SELECT 
    fc.*,
    array_agg(to_json(fs)) AS set_items
FROM 
    flashcard_collection fc
LEFT JOIN 
    flashcard_set fs ON fs.id = ANY(fc.ids)
WHERE 
    fc.user_id = ${id}
GROUP BY 
    fc.id;

        `;

        return collection;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
