"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";

export const updateUserNoteSequence = async (updatedItem: Notes) => {
    try {
        await db`
            UPDATE user_notes
            SET sequence = ${updatedItem.sequence}
            WHERE id = ${updatedItem.id}
        `;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
