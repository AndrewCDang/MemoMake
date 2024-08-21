"use server";
import { db } from "@/app/_lib/db";
import { Notes } from "../toDoList";
import { revalidateTag } from "next/cache";

export const insertNewUserNote = async (newNote: Notes) => {
    try {
        await db`
            INSERT INTO user_notes
            VALUES(${newNote.id}, ${newNote.user_id}, ${newNote.note}, ${newNote.colour}, ${newNote.sequence})
        `;
        revalidateTag("userNotes");
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
