"use server";
import { db } from "@/app/_lib/db";
import { UserHistory } from "@/app/_types/types";

export const updateUserHistory = async ({
    item,
    userId,
}: {
    item: UserHistory;
    userId: string;
}) => {
    try {
        // Fetches previous history
        const lastIds: { user_history: UserHistory[] }[] = await db`
            SELECT to_json(user_history) as user_history
            FROM account
            WHERE user_id = ${userId}
        `;

        const previousHistoryIds =
            lastIds[0]?.user_history[0]?.ids.join(",") || undefined;

        const previousIds = lastIds[0]?.user_history.map((item) =>
            item.ids.join(",")
        );
        const matchingPreviousIndex = previousIds.indexOf(item.ids.join(","));

        if (previousHistoryIds !== item.ids.join(",")) {
            // If new hisotry item and latest history item does not match, add new item to array.
            const newIdsArray = item.ids.map((id) => id);
            const diffArray = item.difficulty.map((diff) => diff);
            const tagArray = item.tags.map((tag) => tag);

            // Adding item to history list
            // Maximum 5 history items
            const update = await db`
                UPDATE account
                SET user_history = CASE
                WHEN array_length(user_history, 1) >= 5 THEN
                    ARRAY_PREPEND(
                        ROW(
                            ARRAY[${db.array(newIdsArray)}]::text[], 
                            ${
                                item.tags.length > 0
                                    ? db`ARRAY[${db.array(tagArray)}]::text[]`
                                    : db`ARRAY[]::text[]`
                            },
                            ${
                                item.difficulty.length > 0
                                    ? db`ARRAY[${db.array(diffArray)}]`
                                    : db`ARRAY[]::difficulty[]`
                            },
                            ${item.content_type}::content_type
                        )::user_history,
                        ${
                            matchingPreviousIndex !== -1
                                ? db`array_remove(user_history, user_history[${
                                      matchingPreviousIndex + 1
                                  }])`
                                : db`array_remove(user_history, user_history[array_length(user_history, 1)])`
                        }
                    )
                ELSE
                    ARRAY_PREPEND(
                        ROW(
                            ARRAY[${newIdsArray}]::text[], 
                            ${
                                item.tags.length > 0
                                    ? db`ARRAY[${db.array(tagArray)}]::text[]`
                                    : db`ARRAY[]::text[]`
                            },
                            ${
                                item.difficulty.length > 0
                                    ? db`ARRAY[${db.array(diffArray)}]`
                                    : db`ARRAY[]::difficulty[]`
                            },
                            ${item.content_type}::content_type
                        )::user_history,
                        ${
                            matchingPreviousIndex !== -1
                                ? db`array_remove(user_history, user_history[${
                                      matchingPreviousIndex + 1
                                  }])`
                                : db``
                        }
                    )
                END
                WHERE user_id = ${userId}
        `;

            return { status: 200, message: "updated history" };
        }

        return {
            status: 200,
            message: "new history item already latest history item",
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
    }
};
// SQL TYPES
// CREATE TYPE user_history AS (
//   ids text[],
//   tags text[],
//   difficulties difficulty[],
//   content_type content_type
// );
