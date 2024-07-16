"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";

export const deleteUserNote = async (noteId: string) => {
    try {
        await db`
            DELETE FROM user_notes
            WHERE id =${noteId}
        `;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
