"use server";
import { db } from "../_lib/db";
import { Flashcard_set } from "../_types/types";

export const fetchPublicFlashsets = async ({
    searchQuery,
}: {
    searchQuery: string;
}): Promise<Flashcard_set[] | undefined> => {
    console.log(searchQuery);
    try {
        const fetch: Flashcard_set[] = await db`
            SELECT fs.*, json_build_object(
                'id', users.id,
                'user_name', users.user_name,
                'image',users.image
            ) as creator
            FROM flashcard_set fs
            LEFT JOIN users ON users.id = fs.user_id
            WHERE set_name  ILIKE ${searchQuery + "%"} OR description ILIKE ${
            searchQuery + "%"
        } OR EXISTS (
                SELECT 1
                FROM unnest(set_categories) AS category
                WHERE category ILIKE ${searchQuery + "%"}
            )
            OR EXISTS (
                SELECT 1
                FROM unnest(set_categories) AS category
                WHERE ${searchQuery + "%"} ILIKE '%' || category || '%'
            );
        `;

        console.log(fetch);
        return fetch;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
