import { db } from "../db";

const fetchStudyDetails = async (id: string, type: "set" | "collection") => {
    try {
        const result = await db`
            SELECT * FROM flashcard_set
            WHERE id = ${id}
        `;
        return result;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
};
