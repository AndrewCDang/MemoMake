"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../_lib/db";
import { coloursType } from "../styles/colours";
import { ThemeColour } from "../_types/types";

export const insertCollection = async ({
    name,
    setIds,
    id,
    categories,
    colours,
    image,
}: {
    name: string;
    setIds: string[];
    id: string;
    categories: string[];
    colours: coloursType | ThemeColour;
    image: string | null;
}) => {
    try {
        await db`
            INSERT INTO flashcard_collection(collection_name,ids,user_id,set_categories,theme_colour, image )
            VALUES(${name},${setIds}, ${id}, ${categories}, ${colours},${
            image || null
        })
        `;

        revalidateTag(`dashboard-${id}`);
        return { status: 200, message: "Collection created" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
