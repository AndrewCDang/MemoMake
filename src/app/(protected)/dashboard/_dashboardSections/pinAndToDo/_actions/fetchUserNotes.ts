"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";

export const fetchUserNotes = async (
    userId: string
): Promise<Notes[] | undefined> => {
    try {
        const userNotes: Notes[] = await db`
            SELECT * FROM user_notes
            WHERE user_id =${userId}
            ORDER BY sequence ASC

        `;
        return userNotes;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
