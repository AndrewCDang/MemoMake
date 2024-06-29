"use server";
import { revalidatePath } from "next/cache";
import { db } from "../_lib/db";
import { ContentType } from "../_types/types";

type DelSetOrCollectionType = {
    contentType: ContentType;
    id: string;
};

export const delSetOrCollection = async ({
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

        if (contentType === "collection") {
            const result = await db`
                DELETE FROM flashcard_collection
                WHERE id = ${id}
                RETURNING id;
            `;
            delResult(result);
        } else if (contentType === "set") {
            const result = await db`
                DELETE FROM flashcard_set
                WHERE id = ${id}
                RETURNING id;
            `;
            delResult(result);
        }

        // Ensure the revalidatePath is properly configured
        revalidatePath("dashboard");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
