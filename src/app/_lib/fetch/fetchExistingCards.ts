import { db } from "../db";
import { Flashcard_item } from "@/app/_types/types";

const fetchExistingCards = async (setId: string): Promise<Flashcard_item[]> => {
    const existingCards = (await db`
        SELECT * FROM flashcard_item
        WHERE set_id = ${setId}
        ORDER BY sequence ASC
    `) as Flashcard_item[];

    return existingCards;
};

export default fetchExistingCards;
