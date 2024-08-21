import { db } from "@/app/_lib/db";
import { Flashcard_collection, Flashcard_set } from "@/app/_types/types";
import { unstable_cache } from "next/cache";

//Create output type
//reduce into array, item in  array can be set or collection with created data
//order by created

type Flashcard_set_liked = Flashcard_set & {
    created: Date;
};

type Flashcard_collection_liked = Flashcard_collection & {
    created: Date;
};

export type Fetched_like_array = (
    | Flashcard_collection_liked
    | Flashcard_set_liked
)[];

export type fetched__items = {
    pinned_sets: Flashcard_set_liked[];
    pinned_collection: Flashcard_collection_liked[];
};
export type fetched_pinned_items = (Flashcard_set | Flashcard_collection)[];

export async function fetchPinnedItem({
    userId,
    limit = 0,
}: {
    userId: string;
    limit?: number;
}): Promise<fetched_pinned_items | undefined> {
    const cachedPins = unstable_cache(
        async () => {
            try {
                const searchLimit = db`LIMIT ${limit}`;

                console.log(userId);

                const fetch: fetched__items[] = await db`
                    WITH pinned_items AS (
                        SELECT favourites
                        FROM account
                        WHERE user_id = ${userId}
                        ${limit ? searchLimit : db``}
                    ), 
                    pinned_sets AS (
                        SELECT 
                            fs.*,
                            json_build_object(
                                'id', u.id,
                                'user_name', u.user_name,
                                'image', u.image
                            ) as creator
                        FROM flashcard_set fs
                        LEFT JOIN users u ON u.id = fs.user_id
                        WHERE fs.id = ANY(SELECT unnest(favourites) FROM pinned_items)
                    ),  
                    pinned_collection AS (
                        SELECT 
                            fc.*,
                            json_build_object(
                                'id', u.id,
                                'user_name', u.user_name,
                                'image', u.image
                            ) as creator
                        FROM flashcard_collection fc
                        LEFT JOIN users u ON u.id = fc.user_id
                        WHERE fc.id = ANY(SELECT unnest(favourites) FROM pinned_items)
                    )
                        SELECT 
                        ( SELECT JSON_AGG(pinned_sets) AS pinned_sets FROM pinned_sets) AS pinned_sets,
                        ( SELECT JSON_AGG(pinned_collection) AS pinned_collection FROM pinned_collection) AS pinned_collection
                    `;

                if (fetch) {
                    const array = [
                        ...fetch[0].pinned_collection,
                        ...fetch[0].pinned_sets,
                    ].sort(
                        (a, b) =>
                            new Date(b.last_modified).getTime() -
                            new Date(a.last_modified).getTime()
                    );

                    return array;
                }
                console.log({ message: "No Pinned items", status: 500 });
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log({ message: error.message, status: 500 });
                } else {
                    console.log({
                        message: "An unknown error occurred",
                        status: 500,
                    });
                }
            }
        },
        [userId],
        { tags: ["pinnedItems"] }
    );
    return cachedPins();
}
