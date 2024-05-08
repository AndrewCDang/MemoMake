"use server";
import { db } from "../_lib/db";

export const insertCollection = async ({
    name,
    setIds,
    id,
    categories,
}: {
    name: string;
    setIds: string[];
    id: string;
    categories: string[];
}) => {
    try {
        await db`
            INSERT INTO flashcard_collection(collection_name,ids,user_id,set_categories)
            VALUES(${name},${setIds}, ${id}, ${categories})
        `;

        return { status: 200, message: "Collection created" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
