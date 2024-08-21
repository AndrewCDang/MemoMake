"use server";
import { revalidateTag } from "next/cache";
import { db } from "../_lib/db";
import { coloursType } from "../styles/colours";
import { ThemeColour } from "../_types/types";

export const updateSet = async ({
    name,
    setId,
    categories,
    description,
    colours,
    image,
    image_id,
}: {
    name?: string;
    setId: string;
    description?: string;
    categories?: string[];
    colours?: coloursType | ThemeColour;
    image?: string | null;
    image_id?: string | null;
}) => {
    try {
        await db`
            UPDATE flashcard_set
                SET
                set_name = COALESCE(${name || null}, set_name),
                set_categories = COALESCE(${
                    categories || null
                }, set_categories),
                description = COALESCE(${description || null}, description),
                theme_colour = COALESCE(${colours || null}, theme_colour), 
                image = COALESCE(${image || null}, image),
                image_id = COALESCE(${image_id || null}, image_id),
                last_modified = ${new Date()}
            WHERE id = ${setId}
        `;
        revalidateTag("dashboardSet");
        return { status: 200, message: "Set updated", data: { setId, image } };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
