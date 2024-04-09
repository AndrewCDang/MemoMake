"use server";
import { revalidatePath } from "next/cache";
import { db } from "../_lib/db";

export const delCard = async (ids: string[]) => {
    try {
        const promises = ids.map(async (item) => {
            await db`
            DELETE FROM flashcard_item
            WHERE id = ${item}
            `;
        });
        await Promise.all(promises);
        revalidatePath("/dashboard/flashcard");
        return { message: "Success: Item Deleted" };
    } catch (error) {
        console.log("Error: Could not delete item from database");
        return { messsage: "Error deleting item from database." };
    }
};
