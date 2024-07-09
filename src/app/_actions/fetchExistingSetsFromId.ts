"use server";
import { db } from "../_lib/db";
import { Flashcard_set } from "../_types/types";

const fetchExistingSetsFromId = async (
    userId: string
): Promise<Flashcard_set[]> => {
    const existingCards = (await db`
        SELECT fs.*, json_build_object(
                'id', users.id,
                'user_name', users.user_name,
                'image',users.image
            ) as creator 
        FROM flashcard_set fs
        LEFT JOIN users ON users.id = fs.user_id
        WHERE user_id = ${userId}
        ORDER BY last_modified ASC
    `) as Flashcard_set[];

    return existingCards;
};

export default fetchExistingSetsFromId;
