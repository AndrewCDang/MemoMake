"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";
import { revalidateTag } from "next/cache";

export const deleteUserNote = async (noteId: string, userId: string) => {
    try {
        await db`
            DELETE FROM user_notes
            WHERE id =${noteId}
        `;

        revalidateTag(`userNotes-${userId}`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
