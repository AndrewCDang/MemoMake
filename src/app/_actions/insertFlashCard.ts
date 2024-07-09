"use server";
import { AuthItemTypes } from "@/schema/itemSchema";
import { db } from "../_lib/db";
import { revalidatePath } from "next/cache";

export type InsertFlashCardTypes = {
    data: AuthItemTypes;
    setId: string;
};

const insertFlashCard = async ({ data, setId }: InsertFlashCardTypes) => {
    try {
        // Getting sequence value
        const sequenceResult = await db`
            SELECT COALESCE(MAX(sequence), 0) + 10 AS next_sequence
            FROM flashcard_item
            WHERE set_id = ${setId}
        `;
        const nextSequence = sequenceResult[0].next_sequence;

        // Inserting card into db
        await db`
                INSERT INTO flashcard_item (set_id, item_question, item_answer, item_tags, difficulty, last_modified, sequence)
                VALUES(${setId}, ${data.item_question}, ${data.item_answer}, ${
            data.item_tags
        }, ${data.difficulty}, ${new Date()}, ${nextSequence}
        )
            `;
        revalidatePath("/dashboard/flashcard");
        return { success: true, message: "Created new flash card!" };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Error: Could not create flash card",
        };
    }
};

export default insertFlashCard;
