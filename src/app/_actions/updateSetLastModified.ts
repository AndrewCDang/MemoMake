"use server";
import { revalidateTag } from "next/cache";
import { db } from "../_lib/db";

export const updateSetLastModified = async (setId: string) => {
    try {
        await db`
            UPDATE flashcard_set
                SET
                    last_modified = ${new Date()}
            WHERE id=${setId}
        `;
        revalidateTag(setId);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
};
