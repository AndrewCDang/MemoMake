"use server";
import { db } from "../_lib/db";
import { Flashcard_collection_preview } from "../_types/types";

export const fetchSetsWithItems = async ({
    collectionId,
    setIds,
}: {
    collectionId: string;
    setIds: string[];
}): Promise<Flashcard_collection_preview | undefined> => {
    try {
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
        WHERE fc.id = ${collectionId}
        `;
        const setWithItems = result[0];

        return setWithItems;
    } catch (error: unknown) {
        if (error instanceof Error)
            console.log({ status: 500, message: error.message });
    }
};

// Legacy attempts

// SELECT
//     fs.*,
//     COALESCE(
//         NULLIF(array_agg(to_json(fi.*)) FILTER (WHERE fi.set_id IS NOT NULL), ARRAY[]::json[]),
//         '{}'::json[]
//     ) AS flashcards
// FROM
//     flashcard_set fs
// LEFT JOIN flashcard_item fi ON fs.id = fi.set_id
// WHERE fs.id = ANY(${setIds})
// GROUP BY fs.id

// WITH flashset_cards AS (
//         SELECT
//             fs.*,
//         COALESCE(
//             NULLIF(array_agg(to_jsonb(fi.*)) FILTER (WHERE fi.set_id IS NOT NULL), ARRAY[]::jsonb[]),
//             '{}'::jsonb[]
//         ) AS flashcards
//     FROM
//         flashcard_set fs
//     LEFT JOIN flashcard_item fi ON fs.id = fi.set_id
//     GROUP BY fs.id
//     )
//     SELECT fc.*, jsonb_agg(fsc.*) as flashsets
//     FROM flashcard_collection fc
//     LEFT JOIN flashcard_set fsc ON fsc.id = ANY(fc.ids)
//     WHERE fc.id = ${collectionId}
//     GROUP BY fc.id

// NULLIF - two args, if two args are equal, return null
// COALESCE, two args, if result returns null, return second arg
