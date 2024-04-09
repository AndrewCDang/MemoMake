"use server";
import { db } from "../_lib/db";
import { revalidatePath } from "next/cache";
import { ColumnName } from "../(protected)/dashboard/flashcard/collection/cardTableTypes";

export type UpdateCardTypes = {
    id: string;
    object: ColumnName;
    value: string | string[];
};

export const updateCard = async ({
    id,
    object,
    value,
}: UpdateCardTypes): Promise<{ status: number; message: String }> => {
    if (object == "item_question" || object == "item_answer") {
        try {
            await db`
            UPDATE flashcard_item
            SET ${db(object)} = ${value}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
            revalidatePath("dashboard/flashcard");
            return { status: 200, message: "Success: Item updated" };
        } catch (error) {
            console.log(error);
            return { status: 400, message: "Error: Unable to update item" };
        }
    }
    if (object == "difficulty") {
        const acceptedValues = ["NA", "EASY", "MEDIUM", "HARD"];
        if (acceptedValues.includes(value as string)) {
            try {
                await db`
            UPDATE flashcard_item
            SET difficulty = ${value}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
                revalidatePath("dashboard/flashcard");
                return { status: 200, message: "Success: Item updated" };
            } catch (error) {
                console.log(error);
                return { status: 400, message: "Error: Unable to update item" };
            }
        }
    }
    if (object == "item_tags") {
        console.log(value);
        const isArray = Array.isArray(value);
        if (isArray) {
            try {
                await db`
            UPDATE flashcard_item
            SET item_tags = ${value}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
                revalidatePath("dashboard/flashcard");
                return { status: 200, message: "Success: Item updated" };
            } catch (error) {
                console.log(error);
                return {
                    status: 400,
                    message: "Error: Unable to update item",
                };
            }
        }
    }
    return { status: 400, message: "Error: Unable to update item" };
};
