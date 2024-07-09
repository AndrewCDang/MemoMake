"use server";
import { revalidatePath } from "next/cache";
import { db } from "../_lib/db";

type UpdateFlashSetSettingTypes = {
    id: string;
    set_name: string | undefined;
    description: string | undefined;
    set_categories: string[] | undefined;
};

export const updateFlashSetSetting = async ({
    id,
    set_name,
    description,
    set_categories,
}: UpdateFlashSetSettingTypes) => {
    try {
        const update = await db`
            UPDATE flashcard_set
            SET
                set_name = COALESCE(${set_name || null}, set_name),
                description = COALESCE(${description || null}, description),
                set_categories = COALESCE(${
                    set_categories || null
                }, set_categories)
            WHERE id = ${id}
            RETURNING set_name
        `;

        revalidatePath("dashboard/edit/");
        return { message: "Updated Set Details", success: true };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
            return { message: error.message, success: false };
        }
        return { message: "ERROR", success: false };
    }
};
