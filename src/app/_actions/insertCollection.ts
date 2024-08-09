"use server";
import { revalidatePath } from "next/cache";
import { db } from "../_lib/db";
import { coloursType } from "../styles/colours";

export const insertCollection = async ({
    name,
    setIds,
    id,
    categories,
    colours,
}: {
    name: string;
    setIds: string[];
    id: string;
    categories: string[];
    colours: coloursType;
}) => {
    try {
        await db`
            INSERT INTO flashcard_collection(collection_name,ids,user_id,set_categories,theme_colour )
            VALUES(${name},${setIds}, ${id}, ${categories}, ${colours})
        `;

        revalidatePath("/dashboard");
        return { status: 200, message: "Collection created" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
