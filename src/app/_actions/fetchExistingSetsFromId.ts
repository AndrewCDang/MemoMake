"use server";
import { db } from "../_lib/db";
import { Flashcard_set } from "../_types/types";

const fetchExistingSetsFromId = async (
    userId: string
): Promise<Flashcard_set[]> => {
    const existingCards = (await db`
        SELECT * FROM flashcard_set
        WHERE user_id = ${userId}
        ORDER BY last_modified ASC
    `) as Flashcard_set[];

    return existingCards;
};

export default fetchExistingSetsFromId;
