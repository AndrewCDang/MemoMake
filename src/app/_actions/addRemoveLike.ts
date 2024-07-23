"use server";

import { Account, ContentType } from "../_types/types";
import { db } from "../_lib/db";
import { revalidatePath } from "next/cache";

export const addRemoveLike = async ({
    id,
    setId,
    revalidate = false,
    contentType,
}: {
    id: string;
    setId: string;
    contentType: ContentType;
    revalidate?: boolean;
}) => {
    try {
        const account: Account[] = await db`
            SELECT * FROM user_likes
            WHERE user_id = ${id} AND item_id =${setId}
        `;

        // If like object does not exist, create
        if (account.length === 0 || !account[0]) {
            try {
                const addLike = await db`
                    INSERT INTO user_likes(item_id,user_id,item_type)
                    VALUES(${setId},${id},${contentType})
                `;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        } else {
            try {
                const removeLike = await db`
                    DELETE FROM user_likes
                    WHERE user_id = ${id} AND item_id =${setId}
                `;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        }

        if (revalidate) {
            revalidatePath("dashboard");
        }
        return { status: 200, message: "Item Updated" };
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return { status: 500, message: error.message };
        }
    }
};
