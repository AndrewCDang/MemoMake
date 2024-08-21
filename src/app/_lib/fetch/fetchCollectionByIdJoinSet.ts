import { db } from "../db";
import { Flashcard_collection, Flashcard_set } from "../../_types/types";
import { unstable_cache } from "next/cache";

export interface Flashcard_collection_set_joined extends Flashcard_collection {
    set_items: Flashcard_set[];
}

type FetchCollectionByIdJoinSetTypes = {
    fetched_items: Flashcard_collection_set_joined[];
    total_count: number;
};

export const fetchCollectionByIdJoinSet = async ({
    id,
    paginate = true,
    pageNum = 1,
    itemsPerPage = 12,
}: {
    id: string;
    paginate?: boolean;
    pageNum?: number;
    itemsPerPage?: number;
}): Promise<FetchCollectionByIdJoinSetTypes | undefined> => {
    const cacheDashboardCollection = unstable_cache(
        async () => {
            try {
                const paginationQuery = db`
                    LIMIT ${itemsPerPage}
                    OFFSET ${(pageNum - 1) * itemsPerPage}
                `;

                const collection: FetchCollectionByIdJoinSetTypes[] = await db`
                WITH fetched_items AS (SELECT *
                FROM (
                    SELECT 
                        fc.*,
                        array_agg(to_json(fs)) AS set_items,
                        json_build_object(
                            'id', users.id,
                            'user_name', users.user_name,
                            'image', users.image
                        ) as creator,
                        COUNT(ul) as like_count
                    FROM 
                        flashcard_collection fc
                    LEFT JOIN 
                        flashcard_set fs ON fs.id = ANY(fc.ids)
                    LEFT JOIN
                        users ON users.id = fc.user_id
                    LEFT JOIN
                        user_likes ul ON ul.item_id = fc.id
                    WHERE 
                        fc.user_id = ${id}
                    GROUP BY fc.id, users.id
                ) subquery
                ORDER BY last_modified DESC
                ${paginate ? paginationQuery : db``}
                ),
                total_count_query AS (
                    SELECT COUNT(fc) as total_count 
                    FROM flashcard_collection fc
                    WHERE fc.user_id =${id}
                )
                SELECT json_agg(fetched_items) AS fetched_items, (
                    SELECT total_count FROM total_count_query
                )
                FROM fetched_items     
                `;

                console.log(collection);

                return collection[0];
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log({ status: 500, message: error.message });
                }
                return undefined;
            }
        },
        [id],
        { tags: ["dashboardCollection"], revalidate: 60 * 60 }
    );

    return cacheDashboardCollection();
};
