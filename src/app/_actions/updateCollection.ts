"use server";
import { revalidateTag } from "next/cache";
import { db } from "../_lib/db";
import { coloursType } from "../styles/colours";
import { ThemeColour } from "../_types/types";
import { auth } from "@/auth";

export const updateCollection = async ({
    name,
    collectionId,
    setIds,
    categories,
    colours,
    image,
}: {
    name?: string;
    collectionId: string;
    setIds?: string[];
    categories?: string[];
    colours?: coloursType | ThemeColour;
    image?: string | null;
}) => {
    const session = await auth();

    try {
        await db`
            UPDATE flashcard_collection
                SET
                collection_name = COALESCE(${name || null}, collection_name),
                ids = COALESCE(${setIds || null}, ids),
                set_categories = COALESCE(${
                    categories || null
                }, set_categories),
                theme_colour = COALESCE(${colours || null}, theme_colour), 
                image = COALESCE(${image || null}, image),
                last_modified = ${new Date()}
            WHERE id = ${collectionId}
        `;
        if (session?.user) {
            revalidateTag(`dashboardCollection-${session.user.id}`);
        }
        revalidateTag(collectionId);
        if (session?.user) {
            revalidateTag(`dashboard-${session.user.id}`);
        }
        return { status: 200, message: "Collection updated" };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
