"use server";
import { unknown } from "zod";
import { db } from "../_lib/db";
import { Flashcard_item } from "../_types/types";

type FetchItemFromSetsTypes = {
    setIds: string[];
};

export const fetchItemsFromSets = async ({
    setIds,
}: FetchItemFromSetsTypes): Promise<Flashcard_item[] | undefined> => {
    try {
        const items: Flashcard_item[] = await db`
            SELECT * FROM flashcard_item
            WHERE set_id = ANY(${setIds})
        `;
        console.log(items);
        return items;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
};
