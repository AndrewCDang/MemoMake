import { db } from "@/app/_lib/db";
import { Flashcard_set } from "@/app/_types/types";
import { unstable_cache } from "next/cache";

interface FetchResult {
    total_count: number;
    fetched_items: Flashcard_set[];
}

export const fetchPopularSets = async ({
    paginate = true,
    itemsPerPage = 12,
    pageNum,
}: {
    paginate?: boolean;
    itemsPerPage: number;
    pageNum: number;
}): Promise<FetchResult | undefined> => {
    const cachedFetchPublicFlashsets = unstable_cache(
        async () => {
            console.log("hahahah");

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
                        ) AS creator,
                        COUNT(ul.*) AS like_count,
                        COUNT(*) OVER() AS total_count
                    FROM flashcard_set fs
                    LEFT JOIN users ON users.id = fs.user_id
                    LEFT JOIN user_likes ul ON ul.item_id = fs.id
                    WHERE public_access = TRUE 
                    AND fs.session_count > 0
                    GROUP BY fs.id, users.id
                    ORDER BY fs.session_count DESC
                    ${paginate ? pagQuery : db``}
                ),
                total_count_query AS (
                    SELECT COUNT(*) AS total_count
                    FROM flashcard_set fs
                    WHERE public_access = TRUE 
                    AND fs.session_count > 0
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
        [paginate.toString(), itemsPerPage.toString(), pageNum.toString()],
        { revalidate: 60 * 10 }
    );
    return cachedFetchPublicFlashsets();
};
