"use server";
import { db } from "@/app/_lib/db";

export const updateUserNoteText = async ({
    updatedNote,
    id,
}: {
    updatedNote: string;
    id: string;
}) => {
    try {
        await db`
            UPDATE user_notes
            SET note = ${updatedNote}
            WHERE id = ${id}
        `;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
