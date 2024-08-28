"use server";
import { AuthItemTypes } from "@/schema/itemSchema";
import { db } from "../_lib/db";
import { revalidateTag } from "next/cache";
import { v4 as uuidV4 } from "uuid";
import { Flashcard_item } from "../_types/types";

export type InsertFlashCardTypes = {
    data: AuthItemTypes & { id?: string };
    setId: string;
    userId: string;
};

const insertFlashCard = async ({
    data,
    setId,
    userId,
}: InsertFlashCardTypes): Promise<Flashcard_item | undefined> => {
    try {
        // Getting sequence value
        const sequenceResult = await db`
            SELECT COALESCE(MAX(sequence), 0) + 10 AS next_sequence
            FROM flashcard_item
            WHERE set_id = ${setId}
        `;
        const nextSequence = sequenceResult[0].next_sequence;

        // Inserting card into db

        const insertedItem: Flashcard_item[] = await db`
            INSERT INTO flashcard_item 
            (id, set_id, item_question, item_answer, item_tags, difficulty, last_modified, sequence)
            VALUES (
                ${data.id || uuidV4()},
                ${setId}, 
                ${data.item_question || null}, 
                ${data.item_answer || null}, 
                ${data.item_tags || null}, 
                ${data.difficulty}, 
                ${new Date()}, 
                ${nextSequence}
            )
            RETURNING *;
            `;
        // revalidatePath("/dashboard/edit");
        revalidateTag(`dashboard-${userId}`);
        revalidateTag(setId);
        return insertedItem[0];
    } catch (error) {
        console.log(error);
    }
};

export default insertFlashCard;
