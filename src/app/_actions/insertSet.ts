"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/db";
import { CreateSetType } from "@/schema/setSchema";

type InsertTypes = {
    data: CreateSetType;
    id: string;
};

export const insertSet = async ({ data, id }: InsertTypes) => {
    try {
        await db`
            INSERT INTO flashcard_set (user_id, set_name, set_categories, description, last_modified)
            VALUES (${id}, ${data.setName}, ${data.categories}, ${
            data.description
        }, ${new Date()})

        `;
        revalidatePath("/dashboard");
        return { success: true, message: "Inserted set into database" };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Could not insert set into database",
        };
    }
};
