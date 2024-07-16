"use server";
import { db } from "@/app/_lib/db";

export const updateUserNoteColour = async ({
    colour,
    id,
}: {
    colour: string;
    id: string;
}) => {
    try {
        await db`
            UPDATE user_notes
            SET colour = ${colour}
            WHERE id = ${id}
        `;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
