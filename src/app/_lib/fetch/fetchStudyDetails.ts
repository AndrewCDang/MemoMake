import { Flashcard_collection, Flashcard_item } from "@/app/_types/types";
import { db } from "../db";
import { unstable_cache } from "next/cache";

export const fetchStudyDetails = async ({
    id,
    type,
}: {
    id: string;
    type: "set" | "collection";
}): Promise<Flashcard_item | Flashcard_collection | undefined> => {
    const cachedStudyDetails = unstable_cache(
        async () => {
            try {
                if (type === "set") {
                    const result: Flashcard_item[] = await db`
                        SELECT 
                            *,
                            json_build_object(
                                'id', users.id,
                                'user_name', users.user_name,
                                'image', users.image
                            ) as creator,
                            FROM flashcard_set fs
                            LEFT JOIN users ON users.id = fs.user_id
                        WHERE fs.id = ${id}
                    `;
                    return result[0];
                } else if (type === "collection") {
                    const result: Flashcard_collection[] = await db`
                        SELECT 
                            *,
                            json_build_object(
                                'id', users.id,
                                'user_name', users.user_name,
                                'image', users.image
                            ) as creator,
                            FROM flashcard_collection fc
                            LEFT JOIN users ON users.id = fc.user_id
                        WHERE fc.id = ${id}
                    `;
                    return result[0];
                }
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
                return undefined;
            }
        },
        [],
        { tags: [id], revalidate: 60 * 60 * 24 }
    );

    return cachedStudyDetails();
};
