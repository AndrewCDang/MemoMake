import { db } from "../db";
import { Flashcard_set } from "../../_types/types";

type FetchExistingSetFromIdTypes = {
    userId: string;
    paginate?: boolean;
    pageNum?: number;
    itemsPerPage?: number;
};

type FetchedFlashcardsTypes = {
    fetched_items: Flashcard_set[];
    total_count: number;
};
const fetchExistingSetsFromId = async ({
    userId,
    paginate = true,
    pageNum = 1,
    itemsPerPage = 12,
}: FetchExistingSetFromIdTypes): Promise<FetchedFlashcardsTypes | null> => {
    try {
        const paginationQuery = db`
            LIMIT ${itemsPerPage}
            OFFSET ${(pageNum - 1) * itemsPerPage}
        `;

        const existingCards = (await db`
        WITH fetched_items AS (
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
            ${paginate ? paginationQuery : db``}
        ),
        total_count_query AS (
            SELECT COUNT(fs) as total_count
            FROM flashcard_set fs
            WHERE fs.user_id = ${userId}
        )
        SELECT json_agg(fetched_items) as fetched_items, (
            SELECT total_count FROM total_count_query
        )
        FROM fetched_items
    


    `) as FetchedFlashcardsTypes[];

        return existingCards[0];
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log(error.message);
        }
        return null;
    }
};

export default fetchExistingSetsFromId;

// const existingCards = (await db`
// SELECT fs.*, json_build_object(
//         'id', users.id,
//         'user_name', users.user_name,
//         'image',users.image
//     ) as creator,
//     COUNT(ul) as like_count
// FROM flashcard_set fs
// LEFT JOIN users ON users.id = fs.user_id
// LEFT JOIN user_likes ul ON ul.item_id = fs.id
// WHERE fs.user_id = ${userId}
// GROUP BY fs.id, users.id
// ORDER BY last_modified ASC
// ${paginate ? paginationQuery : db``}
