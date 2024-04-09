"use server";
import { db } from "../_lib/db";

const fetchSetName = async (id: string) => {
    try {
        const searchSetName = await db`
        SELECT set_name	FROM flashcard_set
        WHERE id = ${id}
        `;
        const setName = searchSetName[0];

        return { setName };
    } catch (error) {
        console.log(error);
    }
};

export default fetchSetName;
