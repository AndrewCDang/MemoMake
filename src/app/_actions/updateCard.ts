"use server";
import { db } from "../_lib/db";
import { revalidatePath, revalidateTag } from "next/cache";
import { ColumnName } from "../(protected)/dashboard/edit/[id]/(components)/cardTableTypes";
import { auth } from "@/auth";

export type UpdateCardTypes = {
    id: string;
    setId: string;
    object: ColumnName;
    value: string | string[] | null;
};

export const updateCard = async ({
    id,
    setId,
    object,
    value,
}: UpdateCardTypes): Promise<{ status: number; message: String }> => {
    const session = await auth();

    const updateTags = () => {
        if (session?.user) {
            revalidateTag(`dashboard-${session.user.id}`);
        }
        revalidateTag(setId);
        revalidateTag(id);
    };

    if (object == "item_question" || object == "item_answer") {
        try {
            await db`
            UPDATE flashcard_item
            SET ${db(object)} = ${value || null}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
            updateTags();
            return { status: 200, message: "Success: Item updated" };
        } catch (error) {
            console.log(error);
            return { status: 400, message: "Error: Unable to update item" };
        }
    }
    if (object == "difficulty") {
        const acceptedValues = ["NA", "EASY", "MEDIUM", "HARD"];
        console.log("UPDATE DIFF");
        if (acceptedValues.includes(value as string)) {
            try {
                await db`
            UPDATE flashcard_item
            SET difficulty = ${value || null}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
                updateTags();
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
            SET item_tags = ${value || null}, last_modified = ${new Date()}
            WHERE id = ${id}
            `;
                updateTags();

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
