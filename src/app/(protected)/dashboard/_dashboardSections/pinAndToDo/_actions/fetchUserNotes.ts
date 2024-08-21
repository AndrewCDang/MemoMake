"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";
import { unstable_cache } from "next/cache";

export const fetchUserNotes = async (
    userId: string
): Promise<Notes[] | undefined> => {
    const cachedUserNotes = unstable_cache(
        async () => {
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
        },
        [userId],
        { tags: ["userNotes"] }
    );
    return cachedUserNotes();
};
