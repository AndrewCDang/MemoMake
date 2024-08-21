import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { db } from "@/app/_lib/db";
import { Flashcard_set, UserHistory } from "@/app/_types/types";
import { ContentType, Difficulty } from "@/app/_types/types";
import { unstable_cache } from "next/cache";

type FetchRecentTestedTypes = {
    userId: string;
};

type FetchHistory = {
    user_history: UserHistory[];
};

export type RecentItemsTypes<T> = {
    content_type: ContentType;
    difficulties: Difficulty[];
    tags: string[];
    score: number;
    content: T;
}[];

export const fetchRecentTested = async ({
    userId,
}: FetchRecentTestedTypes): Promise<
    | RecentItemsTypes<Flashcard_set[] | Flashcard_collection_set_joined[]>
    | undefined
> => {
    console.log(userId);

    const cachedHistory = unstable_cache(
        async () => {
            try {
                const fetchHistory: FetchHistory[] = await db`
            SELECT to_json(user_history) as user_history 
            FROM account 
            WHERE user_id = ${userId}
        `;

                const historyItems = fetchHistory[0]
                    .user_history as UserHistory[];
                if (!historyItems) {
                    console.log({ status: 200, message: "no recent items" });
                    return undefined;
                }

                // Ids
                const fetchPromises = historyItems.map(async (item) => {
                    const flattenedIds = item.ids.flat();
                    if (item.content_type === "collection") {
                        const results = (await db`
                    SELECT fc.*, array_agg(to_json(fs)) AS set_items
                    FROM flashcard_collection fc
                    LEFT JOIN flashcard_set fs ON fs.id = ANY(fc.ids)
                    WHERE fc.id = ANY(${db.array(flattenedIds)}::uuid[])
                    GROUP BY fc.id
                `) as Flashcard_collection_set_joined[];
                        return {
                            content_type: "collection" as ContentType,
                            difficulties: item.difficulties[0],
                            tags: item.tags[0],
                            score: item.score,
                            content: results,
                        };
                    } else if (item.content_type === "set") {
                        const results = (await db`
                    SELECT *, 'set' AS content_type
                    FROM flashcard_set
                    WHERE id = ANY(${db.array(flattenedIds)}::uuid[])
                `) as Flashcard_set[];
                        return {
                            content_type: "set" as ContentType,
                            content: results,
                            difficulties: item.difficulties[0],
                            score: item.score,
                            tags: item.tags[0],
                        };
                    }
                    return undefined;
                });

                const flashcards = await Promise.all(fetchPromises);
                const filteredFlashcards = flashcards.filter(
                    (item): item is NonNullable<typeof item> =>
                        item !== undefined
                );

                return filteredFlashcards;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        },
        [userId],
        { tags: ["userHistory"] }
    );

    return cachedHistory();
};

// Legacy Code

// // Query flashcard_set
// const flashcardSets = (await db`
//     SELECT *, 'set' AS content_type
//     FROM flashcard_set
//     WHERE id = ANY(ARRAY[${db.array(idsArray)}]::uuid[])
// `) as Flashcard_set[];

// // Query flashcard_collection
// const flashcardCollections = (await db`
//     SELECT *, 'collection' AS content_type
//     FROM flashcard_collection
//     WHERE id = ANY(ARRAY[${db.array(idsArray)}]::uuid[])
// `) as Flashcard_collection[];

// // Adding order number to each item
// const flashcardSetsOrdered = flashcardSets.map((item) => {
//     return { item, order_number: idsArray.indexOf(item.id) };
// });
// const flashcardCollectionsOrdered = flashcardSets.map((item) => {
//     return { item, order_number: idsArray.indexOf(item.id) };
// });

// // Combine results (keeping their structure)
// const combinedResults = [
//     ...flashcardSetsOrdered,
//     ...flashcardCollectionsOrdered,
// ].sort((a, b) => a.order_number - b.order_number);

// console.log(combinedResults);
// return combinedResults;

// SELECT 1 AS order_column, 'set' AS source_table, *
// FROM flashcard_set
// WHERE id = 1234

// UNION ALL

// SELECT 2 AS order_column, 'collection' AS source_table, *
// FROM flashcard_collection
// WHERE id = 1321

// UNION ALL

// SELECT 3 AS order_column, 'set' AS source_table, *
// FROM flashcard_set
// WHERE id = 1222

// ORDER BY order_column;
