import { db } from "../db";
import { Flashcard_set } from "../../_types/types";
import { unstable_cache } from "next/cache";

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
    const cachedFetchPublicFlashsets = unstable_cache(
        async () => {
            try {
                const pagQuery = db`
                    LIMIT ${itemsPerPage}
                    OFFSET ${(pageNum - 1) * itemsPerPage}
                `;

                // Use a type assertion with caution, and ensure the query is correct
                const result: FetchResult[] = await db`
                WITH search_terms AS (
                    SELECT unnest(string_to_array(lower(${searchQuery}), ' ')) AS term
                ),
                fetched_items AS (
                    SELECT fs.*, 
                        json_build_object(
                            'id', users.id,
                            'user_name', users.user_name,
                            'image', users.image
                        ) AS creator,
                        COUNT(ul.*) AS like_count,
                        COUNT(*) OVER() AS total_count
                    FROM flashcard_set fs
                    LEFT JOIN users ON users.id = fs.user_id
                    LEFT JOIN user_likes ul ON ul.item_id = fs.id
                    WHERE public_access = TRUE 
                    AND EXISTS (
                        SELECT 1
                        FROM search_terms st
                        WHERE 
                            set_name ILIKE '%' || st.term || '%'
                            OR description ILIKE '%' || st.term || '%'
                            OR EXISTS (
                                SELECT 1
                                FROM unnest(set_categories) AS category
                                WHERE category ILIKE '%' || st.term || '%'
                            )
                            OR EXISTS (
                                SELECT 1
                                FROM unnest(set_categories) AS category
                                WHERE st.term || '%' ILIKE '%' || category || '%'
                            )
                    )
                    GROUP BY fs.id, users.id
                    ${paginate ? pagQuery : db``}
                ),
                total_count_query AS (
                    SELECT COUNT(*) AS total_count
                    FROM flashcard_set fs
                    LEFT JOIN user_likes ul ON ul.item_id = fs.id
                    LEFT JOIN users ON users.id = fs.user_id
                    WHERE public_access = TRUE 
                    AND EXISTS (
                        SELECT 1
                        FROM search_terms st
                        WHERE 
                            set_name ILIKE '%' || st.term || '%'
                            OR description ILIKE '%' || st.term || '%'
                            OR EXISTS (
                                SELECT 1
                                FROM unnest(set_categories) AS category
                                WHERE category ILIKE '%' || st.term || '%'
                            )
                    )
                )
                SELECT (SELECT total_count FROM total_count_query) AS total_count,
                    json_agg(fetched_items) AS fetched_items 
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
        },
        [
            searchQuery,
            paginate.toString(),
            itemsPerPage.toString(),
            pageNum.toString(),
        ],
        { revalidate: 60 * 10 }
    );
    return cachedFetchPublicFlashsets();
};
