import { db } from "../db";
import { Flashcard_set } from "../../_types/types";

interface FetchResult {
    total_count: number;
    fetched_items: Flashcard_set[];
}

export const fetchPublicFlashsets = async ({
    searchQuery,
    paginate = true,
    itemsPerPage = 12,
    pageNum,
}: {
    searchQuery: string;
    paginate?: boolean;
    itemsPerPage: number;
    pageNum: number;
}): Promise<FetchResult | undefined> => {
    try {
        const pagQuery = db`
            LIMIT ${itemsPerPage}
            OFFSET ${(pageNum - 1) * itemsPerPage}
        `;

        // Use a type assertion with caution, and ensure the query is correct
        const result: FetchResult[] = await db`
            WITH fetched_items AS (
                SELECT fs.*, 
                    json_build_object(
                        'id', users.id,
                        'user_name', users.user_name,
                        'image', users.image
                    ) as creator,
                    COUNT(ul.*) as like_count,
                    COUNT(*) OVER() as total_count
                FROM flashcard_set fs
                LEFT JOIN users ON users.id = fs.user_id
                LEFT JOIN user_likes ul ON ul.item_id = fs.id
                WHERE public_access = TRUE 
                AND (set_name ILIKE ${searchQuery + "%"} 
                OR description ILIKE ${searchQuery + "%"} 
                OR EXISTS (
                    SELECT 1
                    FROM unnest(set_categories) AS category
                    WHERE category ILIKE ${searchQuery + "%"}
                )
                OR EXISTS (
                    SELECT 1
                    FROM unnest(set_categories) AS category
                    WHERE ${searchQuery + "%"} ILIKE '%' || category || '%'
                ))  
                GROUP BY fs.id, users.id
                ${paginate ? pagQuery : db``}
            ), 
            total_count_query AS (
                SELECT COUNT(fs.*) as total_count
                FROM flashcard_set fs
                WHERE public_access = TRUE 
                AND (set_name ILIKE ${searchQuery + "%"} 
                OR description ILIKE ${searchQuery + "%"} 
                OR EXISTS (
                    SELECT 1
                    FROM unnest(set_categories) AS category
                    WHERE category ILIKE ${searchQuery + "%"}
                )
                OR EXISTS (
                    SELECT 1
                    FROM unnest(set_categories) AS category
                    WHERE ${searchQuery + "%"} ILIKE '%' || category || '%'
                ))  
            )
            SELECT (SELECT total_count FROM total_count_query) AS total_count,
                json_agg(fetched_items) as fetched_items 
            FROM fetched_items
        `;

        if (result.length > 0) {
            console.log(result[0]);
            return result[0];
        }
        return undefined;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return undefined;
    }
};
