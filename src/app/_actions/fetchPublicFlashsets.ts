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
            SELECT fs.*, 
                json_build_object(
                    'id', users.id,
                    'user_name', users.user_name,
                    'image',users.image
                ) as creator,
                COUNT(ul.*) as like_count
            FROM flashcard_set fs
            LEFT JOIN users ON users.id = fs.user_id
            LEFT JOIN user_likes ul ON ul.item_id = fs.id
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
            )
            GROUP BY fs.id, users.id

        `;

        console.log(fetch);
        return fetch;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

// SQL NOTES

// + "%": The % symbol in SQL's LIKE or ILIKE patterns represents zero or more characters. By appending % to searchQuery, you're creating a pattern that matches any string that starts with the value of searchQuery.
// For example, if searchQuery is bookstore, then ${searchQuery + "%"} becomes bookstore%. This pattern will match any string that starts with "bookstore" (e.g., "bookstore", "bookstore1", "bookstoreABC", etc.).

// '%' || category || '%': This concatenates %, the value of category, and another %. The resulting pattern will match any string that contains the category value anywhere within it.
// For example, if category is books, then '%books%' is a pattern that will match any string containing "books" (e.g., "mybooks", "bookshelf", "ebooks", etc.).
