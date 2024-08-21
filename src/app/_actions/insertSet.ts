"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../_lib/db";
import { CreateSetType } from "@/schema/setSchema";
import { Flashcard_set } from "../_types/types";

type InsertTypes = {
    data: CreateSetType;
    id: string;
};

export const insertSet = async ({
    data,
    id,
}: InsertTypes): Promise<Flashcard_set | undefined> => {
    try {
        const insertedSet: Flashcard_set[] = await db`
            INSERT INTO flashcard_set (user_id, set_name, set_categories, description, theme_colour, last_modified)
            VALUES (${id}, ${data.setName}, ${
            data.categories ? data.categories : null
        },
        ${data.description || null},
        ${data.colours || null},
        ${new Date()})
        RETURNING *;
        `;
        revalidateTag("dashboardSet");
        return insertedSet[0];
    } catch (error) {
        console.log(error);
    }
};
