import { db } from "../db";
export type tagsCollectionTypes = {
    id: string;
    set_name: string;
    item_tags: string[];
    set_id: string;
};

export const fetchTagsInCollection = async (
    userId: string
): Promise<tagsCollectionTypes[] | undefined> => {
    try {
        const tags: tagsCollectionTypes[] = await db`
        SELECT
            fs.id,
            fs.set_name,
            COALESCE(ARRAY_AGG(DISTINCT tag) FILTER (WHERE tag IS NOT NULL), ARRAY[]::text[]) as item_tags
        FROM
            flashcard_item fi
        RIGHT JOIN flashcard_set fs ON fi.set_id = fs.id
        LEFT JOIN LATERAL unnest(fi.item_tags) AS u(tag) ON true
        WHERE fs.user_id = ${userId}
        GROUP BY 
            fs.id, fs.set_name
`;
        return tags;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error);
        }
    }
};
