"use server";
import { db } from "@/app/_lib/db";
import { UserHistory } from "@/app/_types/types";
import { FetchEventResult } from "next/dist/server/web/types";

type FetchRecentTestedTypes = {
    userId: string;
};

export const fetchRecentTested = async ({ userId }: FetchRecentTestedTypes) => {
    try {
        const fetchHistory = await db`
    SELECT to_json(user_history) as user_history 
    FROM account 
    WHERE user_id = ${userId}
`;

        const historyItems = fetchHistory[0].user_history as UserHistory[];
        if (!historyItems) return { status: 200, message: "no recent items" };

        const historyItemsQuery = historyItems
            .map((item, index) => {
                if (item.content_type === "collection") {
                    const mappedIds = item.ids[0]
                        .split(",")
                        .map((id) => `'${id}'`)
                        .join(",");
                    return `
            SELECT fc.*, ${index} AS order_number, ${`'${item.content_type}'`} AS content_type
            FROM flashcard_collection fc 
            WHERE fc.id = ANY(ARRAY[${mappedIds}]::uuid[])
        `;
                } else if (item.content_type === "set") {
                    const mappedIds = item.ids[0]
                        .split(",")
                        .map((id) => `'${id}'`)
                        .join(",");
                    return `
            SELECT fs.*, ${index} AS order_number, ${`'${item.content_type}'`} AS content_type
            FROM flashcard_set fs 
            WHERE fs.id = ANY(ARRAY[${mappedIds}]::uuid[])
        `;
                }
            })
            .join(" UNION ALL ");

        const fetchQuery = `
    ${historyItemsQuery} 
    ORDER BY order_number
`;

        const finalQuery = await db.unsafe(fetchQuery);

        return finalQuery;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};

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
