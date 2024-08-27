import { unstable_cache } from "next/cache";
import { db } from "../db";
import { Flashcard_collection_set_joined } from "./fetchCollectionByIdJoinSet";

interface FetchSearchCollection {
    total_count: number;
    fetched_items: Flashcard_collection_set_joined[] | undefined;
}

export const fetchPublicFlashCollections = async ({
    searchQuery,
    itemsPerPage,
    pageNum,
    paginate = true,
}: {
    searchQuery: string;
    itemsPerPage: number;
    pageNum: number;
    paginate: boolean;
}): Promise<FetchSearchCollection | undefined> => {
    const cachedPublicFlashCollections = unstable_cache(
        async () => {
            const pagQuery = db`
                        LIMIT ${itemsPerPage}
                        OFFSET ${(pageNum - 1) * itemsPerPage}
                    `;

            const whereSearchClause = db`
                     WHERE fc.public_access = TRUE
                        AND EXISTS (
                            SELECT 1
                            FROM search_terms st
                            WHERE
                                fc.collection_name ILIKE '%' || st.term || '%'
                                OR fc.description ILIKE '%' || st.term || '%'
                                OR EXISTS (
                                    SELECT 1
                                    FROM unnest(fc.set_categories) AS category
                                    WHERE category ILIKE '%' || st.term || '%'
                                )
                        )
                      
                `;

            try {
                const fetch: FetchSearchCollection[] = await db`
                    WITH search_terms AS (
                        SELECT unnest(string_to_array(lower(${searchQuery}), ' ')) AS term
                    ), 
                    fetched_items AS (
                        SELECT fc.*, 
                            json_build_object(
                                'id', users.id,
                                'user_name', users.user_name,
                                'image',users.image
                            ) as creator,
                            COUNT(ul.*) as like_count,
                            array_agg(to_json(fs)) AS set_items
                        FROM flashcard_collection fc
                        LEFT JOIN users ON users.id = fc.user_id
                        LEFT JOIN user_likes ul ON ul.item_id = fc.id
                        LEFT JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                       ${whereSearchClause}
                        GROUP BY fc.id, users.id
                        ${paginate ? pagQuery : db``}
                ),
                    total_count AS (
                    SELECT 
                        COUNT(fc.*) as count
                        FROM flashcard_collection fc
                        LEFT JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                        ${whereSearchClause}
                     
                    )
                        SELECT (SELECT count FROM total_count) AS total_count,
                            json_agg(fetched_items) as fetched_items 
                        FROM fetched_items
                    `;

                return fetch[0];
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log("searcherror");
                    console.log(error.message);
                }
            }
        },
        [
            searchQuery,
            itemsPerPage.toString(),
            pageNum.toString(),
            paginate.toString(),
        ],
        { revalidate: 60 * 10 }
    );
    return cachedPublicFlashCollections();
};
