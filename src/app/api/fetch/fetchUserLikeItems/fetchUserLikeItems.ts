import { db } from "@/app/_lib/db";
import { Flashcard_collection, Flashcard_set } from "@/app/_types/types";
import { unstable_cache } from "next/cache";

//Create output type
//reduce into array, item in  array can be set or collection with created data
//order by created

export type Flashcard_set_liked = Flashcard_set & {
    created: Date;
};

export type Flashcard_collection_liked = Flashcard_collection & {
    created: Date;
};

export type Fetched_like_array = (
    | Flashcard_collection_liked
    | Flashcard_set_liked
)[];

export type Fetch_like_objects = {
    liked_sets: Flashcard_set_liked[];
    liked_collection: Flashcard_collection_liked[];
};

export async function fetchUserLikeItems({
    userId,
    limit = 0,
}: {
    userId: string;
    limit?: number;
}): Promise<(Flashcard_collection_liked | Flashcard_set_liked)[] | undefined> {
    const cachedAccount = unstable_cache(
        async () => {
            try {
                const searchLimit = db`LIMIT ${limit}`;

                const fetch: Fetch_like_objects[] = await db`
            WITH like_objects AS (
                SELECT * 
                FROM user_likes
                WHERE user_id = ${userId}
                ORDER BY created DESC
                ${limit ? searchLimit : db``}
            ), 
            liked_sets AS (
                SELECT 
                    fs.*, 
                    lo.created,
                    json_build_object(
                        'id', u.id,
                        'user_name', u.user_name,
                        'image', u.image
                    ) as creator
                FROM flashcard_set fs
                JOIN like_objects lo ON lo.item_id = fs.id
                LEFT JOIN users u ON u.id = fs.user_id
            ),  
            liked_collection AS (
                SELECT 
                    fc.*,
                    lo.created,
                    json_build_object(
                        'id', u.id,
                        'user_name', u.user_name,
                        'image', u.image
                    ) as creator
                FROM flashcard_collection fc
                JOIN like_objects lo ON lo.item_id = fc.id
                LEFT JOIN users u ON u.id = fc.user_id
            )
            SELECT 
                array_agg(to_json(lc)) AS liked_collection, 
                (
                    SELECT array_agg(to_json(ls)) 
                    FROM liked_sets ls
                ) AS liked_sets
            FROM liked_collection lc;
               
                `;
                console.log(fetch);
                if (fetch) {
                    const array = Object.values(fetch[0])
                        .flat()
                        .filter((item) => item !== null)
                        .sort(
                            (a, b) =>
                                new Date(b.created).getTime() -
                                new Date(a.created).getTime()
                        );

                    return array;
                }
                console.log({ message: "No liked items", status: 500 });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.error("Fetch error:", error);
                    console.log({ message: error.message, status: 500 });
                } else {
                    console.error("Unknown error:", error);
                    console.log({
                        message: "An unknown error occurred",
                        status: 500,
                    });
                }
            }
        },
        [userId],
        { tags: [`userLikes-${userId}`] }
    );
    return cachedAccount();
}
