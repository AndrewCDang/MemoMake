import { db } from "../db";
import { Flashcard_set } from "../../_types/types";

export const fetchSet = async (
    setId: string
): Promise<Flashcard_set | undefined> => {
    try {
        const fetchSet = (
            await db`
            SELECT * FROM flashcard_set
            WHERE id = ${setId}
        `
        )[0] as Flashcard_set;

        return fetchSet;
    } catch (error) {
        console.log(error);
        return undefined;
    }
};
