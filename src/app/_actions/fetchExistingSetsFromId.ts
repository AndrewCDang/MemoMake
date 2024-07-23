"use server";
import { db } from "../_lib/db";
import { Flashcard_set } from "../_types/types";

const fetchExistingSetsFromId = async (
    userId: string
): Promise<Flashcard_set[]> => {
    try {
        const existingCards = (await db`
        SELECT fs.*, json_build_object(
                'id', users.id,
                'user_name', users.user_name,
                'image',users.image
            ) as creator,
            COUNT(ul) as like_count
        FROM flashcard_set fs
        LEFT JOIN users ON users.id = fs.user_id
        LEFT JOIN user_likes ul ON ul.item_id = fs.id 
        WHERE fs.user_id = ${userId}
        GROUP BY fs.id, users.id
        ORDER BY last_modified ASC
    `) as Flashcard_set[];

        return existingCards;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return [];
    }
};

export default fetchExistingSetsFromId;
