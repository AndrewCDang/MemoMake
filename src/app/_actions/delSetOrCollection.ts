"use server";
import { revalidateTag } from "next/cache";
import { db } from "../_lib/db";
import { ContentType } from "../_types/types";

type DelSetOrCollectionType = {
    userId: string;
    contentType: ContentType;
    id: string;
};

export const delSetOrCollection = async ({
    userId,
    contentType,
    id,
}: DelSetOrCollectionType) => {
    try {
        const delResult = (result: any[]) => {
            if (result.length > 0) {
                console.log(`Record with id ${id} deleted successfully.`);
            } else {
                console.log(`Record with id ${id} not found.`);
            }
        };

        let revalidateLikes = false;
        let revalidatePins = false;

        if (contentType === "collection") {
            const result = await db`
                DELETE FROM flashcard_collection
                WHERE id = ${id} AND user_id = ${userId}
                RETURNING id
            `;

            const delLikeResult = await db`
                DELETE FROM user_likes
                WHERE item_id = ${id}
                RETURNING id
            `;
            if (delLikeResult[0]?.id) {
                revalidateLikes = true;
            }

            const delPinsResult = await db`
                 DELETE FROM user_pins
                WHERE item_id = ${id}
                RETURNING id
            `;

            if (delPinsResult[0]?.id) {
                revalidatePins = true;
            }

            delResult(result);
        } else if (contentType === "set") {
            // Deletes Set
            const result = await db`
                DELETE FROM flashcard_set
                WHERE id = ${id} AND user_id = ${userId}
                RETURNING id
            `;
            const delLikeResult = await db`
               DELETE FROM user_likes
                WHERE item_id = ${id}
                RETURNING id
            `;
            if (delLikeResult[0]?.id) {
                revalidateLikes = true;
            }
            const delPinsResult = await db`
            DELETE FROM user_pins
                WHERE item_id = ${id}
                RETURNING id
            `;
            if (delPinsResult[0]?.id) {
                revalidatePins = true;
            }

            // Deletes Set From Collection
            delResult(result);
        }

        // Ensure the revalidatePath is properly configured
        revalidateTag(`dashboard-${userId}`);
        revalidateTag(id);
        if (revalidateLikes) {
            revalidateTag(`userLikes-${userId}`);
        }
        if (revalidatePins) {
            revalidateTag(`userPins-${userId}`);
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
