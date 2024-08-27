import { db } from "../db";
import {
    Difficulty,
    Flashcard_collection_with_cards,
    Flashcard_set_with_cards,
} from "../../_types/types";
import { unstable_cache } from "next/cache";

type FetchObject = {
    type: "collection" | "set";
    id: string[];
};

export const studyFetchFlashCards = async ({
    fetchObject,
    tags = [],
    difficulties = [],
}: {
    fetchObject: FetchObject;
    tags?: string[];
    difficulties?: Difficulty[];
}): Promise<
    Flashcard_collection_with_cards[] | Flashcard_set_with_cards[] | undefined
> => {
    const tagsQuery =
        difficulties.length > 0
            ? db`AND fi.difficulty = ANY(${difficulties})`
            : db``;
    const diffQuery = tags.length > 0 ? db`AND fi.item_tags && ${tags}` : db``;
    try {
        if (fetchObject.type === "collection") {
            const collection: Flashcard_collection_with_cards[] = await db`
                            SELECT 
                                fc.*, 
                                array_agg(to_json(fi.*)) AS flashcards, 
                                array_agg(DISTINCT fs.set_name) AS sets,             
                                json_build_object(
                                    'id', u.id,
                                    'user_name', u.user_name,
                                    'image', u.image
                                ) as creator
                            FROM flashcard_collection fc
                            JOIN flashcard_item fi ON fi.set_id = ANY(fc.ids)
                            JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                            LEFT JOIN users u ON u.id = fc.user_id
                            WHERE fc.id = ANY(${fetchObject.id}) ${tagsQuery} ${diffQuery}
                            GROUP BY fc.id, u.id
                            `;

            return collection;
        } else if (fetchObject.type === "set") {
            const set: Flashcard_set_with_cards[] = await db`
                            SELECT 
                                fs.*, 
                                array_agg(to_json(fi.*)) AS flashcards,
                                  json_build_object(
                                    'id', u.id,
                                    'user_name', u.user_name,
                                    'image', u.image
                                ) as creator
                            FROM flashcard_set fs
                            JOIN flashcard_item fi ON fi.set_id = fs.id
                            LEFT JOIN users u ON u.id = fs.user_id
                            WHERE fs.id = ANY(${fetchObject.id}) ${tagsQuery} ${diffQuery}
                            GROUP BY fs.id, u.id
                            `;
            return set;
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
