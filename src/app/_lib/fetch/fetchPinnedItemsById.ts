import { db } from "@/app/_lib/db";
import { Flashcard_collection, Flashcard_set } from "@/app/_types/types";
import { unstable_cache } from "next/cache";

//Create output type
//reduce into array, item in  array can be set or collection with created data
//order by created

type Flashcard_set_pinned = Flashcard_set & {
    created: Date;
};

type Flashcard_collection_pinned = Flashcard_collection & {
    created: Date;
};

export type Fetched_pin_array = (
    | Flashcard_set_pinned
    | Flashcard_collection_pinned
)[];

export type Fetch_pin_objects = {
    pinned_sets: Flashcard_set_pinned[];
    pinned_collection: Flashcard_collection_pinned[];
};

export async function fetchUserPinItems({
    userId,
    limit = 0,
}: {
    userId: string;
    limit?: number;
}): Promise<Fetched_pin_array | undefined> {
    const cachedAccountPins = unstable_cache(
        async () => {
            try {
                const searchLimit = db`LIMIT ${limit}`;

                const fetch: Fetch_pin_objects[] = await db`
                WITH pin_objects AS (
                    SELECT * 
                    FROM user_pins
                    WHERE user_id = ${userId}
                    ORDER BY created DESC
                    ${limit ? searchLimit : db``}
                ), 
                pinned_sets AS (
                    SELECT 
                        fs.*, 
                        po.created,
                        json_build_object(
                            'id', u.id,
                            'user_name', u.user_name,
                            'image', u.image
                        ) as creator
                    FROM flashcard_set fs
                    JOIN pin_objects po ON po.item_id = fs.id
                    LEFT JOIN users u ON u.id = fs.user_id
                ),  
                pinned_collection AS (
                    SELECT 
                        fc.*,
                        po.created,
                        json_build_object(
                            'id', u.id,
                            'user_name', u.user_name,
                            'image', u.image
                        ) as creator
                    FROM flashcard_collection fc
                    JOIN pin_objects po ON po.item_id = fc.id
                    LEFT JOIN users u ON u.id = fc.user_id
                )
                SELECT 
                    array_agg(to_json(lc)) AS pinned_collection, 
                    (
                        SELECT array_agg(to_json(ls)) 
                        FROM pinned_sets ls
                    ) AS pinned_sets
                FROM pinned_collection lc;
               
                `;
                if (fetch) {
                    const array = Object.values(fetch[0])
                        .flat()
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
        [],
        { tags: [`userPins-${userId}`] }
    );
    return cachedAccountPins();
}
