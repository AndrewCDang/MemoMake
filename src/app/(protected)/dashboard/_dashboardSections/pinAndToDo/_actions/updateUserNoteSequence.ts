"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";
import { revalidateTag } from "next/cache";

export const updateUserNoteSequence = async (
    updatedItem: Notes,
    userId: string
) => {
    try {
        await db`
            UPDATE user_notes
            SET sequence = ${updatedItem.sequence}
            WHERE id = ${updatedItem.id}
        `;
        revalidateTag(`userNotes-${userId}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
