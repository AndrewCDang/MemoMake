"use server";
import { db } from "../_lib/db";
import {
    Flashcard_collection_preview,
    Flashcard_set_with_cards,
} from "../_types/types";

export const fetchSetsWithItems = async ({
    fetchObject,
}: {
    fetchObject: { id: string | string[]; type: "collection" | "set" };
}): Promise<
    | Flashcard_collection_preview
    | Flashcard_set_with_cards[]
    | Flashcard_collection_preview[]
    | undefined
> => {
    const isArray = Array.isArray(fetchObject.id);
    console.log(fetchObject.id);
    console.log(fetchObject.type);

    console.log(isArray);

    try {
        // Fetching single collection item
        if (fetchObject.type === "collection") {
            // Is NOT array
            if (!isArray) {
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
                // If arg is an array
            } else if (isArray) {
                const results: Flashcard_collection_preview[] = await db`
                WITH cte_collection AS (
                    SELECT ARRAY_AGG(fs.id) AS set_id_array
                    FROM flashcard_collection fc
                    JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                    WHERE fc.id = ANY(${fetchObject.id})
                ),
                cte_set AS (
                    SELECT fs.id, fs.set_name, fs.theme_colour, json_agg(fi.*) AS flashcards
                    FROM flashcard_set fs
                    JOIN flashcard_item fi ON fi.set_id = fs.id
                    JOIN cte_collection cc ON TRUE
                    WHERE fs.id = ANY(cc.set_id_array)
                    GROUP BY fi.set_id, fs.id, fs.set_name, fs.theme_colour
                ),
                cte_result AS (
                    SELECT fc.*, json_agg(json_build_object('id',cs.id, 'set_name',cs.set_name, 'theme_colour', cs.theme_colour, 'flashcards',cs.flashcards)) AS sets
                    FROM flashcard_collection fc
                    JOIN cte_set cs ON cs.id = ANY(fc.ids)
                    WHERE fc.id = ANY(${fetchObject.id})
                    GROUP BY fc.id
                )
                SELECT * FROM cte_result
                `;
                console.log(results);
                return results;
            }
        } else if (fetchObject.type === "set") {
            if (!isArray) {
                // Is NOT Array - Fetching single set item
                const fetchSet: Flashcard_set_with_cards[] = await db`
                SELECT fs.*, array_agg(to_json(fi.*)) AS flashcards FROM flashcard_set fs
                LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
                WHERE fs.id = ${fetchObject.id}
                GROUP BY fs.id
                `;
                return fetchSet;
            } else if (isArray) {
                // IS ARRAY -  Fetching Multiple set items
                const results: Flashcard_set_with_cards[] = await db`
                SELECT fs.*, array_agg(to_json(fi.*)) AS flashcards FROM flashcard_set fs
                LEFT JOIN flashcard_item fi ON fi.set_id = fs.id
                WHERE fs.id = ANY(${fetchObject.id})
                GROUP BY fs.id
                `;
                return results;
            }
        }
    } catch (error: unknown) {
        if (error instanceof Error)
            console.log({ status: 500, message: error.message });
    }
};
