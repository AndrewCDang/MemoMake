"use server";
import { db } from "@/app/_lib/db";
import { ContentType, Difficulty, UserHistory } from "@/app/_types/types";
import { revalidatePath } from "next/cache";

export const updateUserHistory = async ({
    item,
    userId,
}: {
    item: {
        ids: string[];
        tags: string[];
        difficulties: Difficulty[];
        content_type: ContentType;
        correct: number;
    };
    userId: string;
}) => {
    try {
        // Fetches previous history
        const lastIds: { user_history: UserHistory[] }[] = await db`
            SELECT to_json(user_history) as user_history
            FROM account
            WHERE user_id = ${userId}
        `;

        const previousIds = lastIds[0]?.user_history.map((item) =>
            item.ids.join(",")
        );

        const matchingPreviousIndex = previousIds.indexOf(item.ids.join(","));

        // If new history item and latest history item does not match, add new item to array.
        const newIdsArray = item.ids;
        const diffArray = item.difficulties;
        console.log(diffArray);
        const tagArray = item.tags;
        console.log(tagArray);

        // Construct removeArrayElement based on matchingPreviousIndex
        const removeArrayElement =
            matchingPreviousIndex !== -1
                ? `array_remove(user_history, user_history[${
                      matchingPreviousIndex + 1
                  }])`
                : `array_remove(user_history, user_history[array_length(user_history, 1)])`;

        // Construct the SQL query
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
                                item.difficulties.length > 0
                                    ? db`ARRAY[${db.array(
                                          diffArray
                                      )}]::difficulty[]`
                                    : db`ARRAY[]::difficulty[]`
                            },
                             ${db`${item.content_type}::content_type`},
                             ${item.correct}
                        )::user_history,
                        ${db.unsafe(removeArrayElement)}
                    )
                ELSE
                    ARRAY_PREPEND(
                        ROW(
                            ARRAY[${db.array(newIdsArray)}]::text[], 
                            ${
                                item.tags.length > 0
                                    ? db`ARRAY[${db.array(tagArray)}]::text[]`
                                    : db`ARRAY[]::text[]`
                            },
                            ${
                                item.difficulties.length > 0
                                    ? db`ARRAY[${db.array(
                                          diffArray
                                      )}]::difficulty[]`
                                    : db`ARRAY[]::difficulty[]`
                            },
                             ${db`${item.content_type}::content_type`},
                             ${item.correct}
                        )::user_history,
                        user_history
                    )
                END
                WHERE user_id = ${userId}
            `;

        revalidatePath("dashboard");
        return { status: 200, message: "updated history" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
    }
};
