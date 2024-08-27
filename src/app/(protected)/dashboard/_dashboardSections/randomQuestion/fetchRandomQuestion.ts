import React from "react";
import { db } from "@/app/_lib/db";
import { unstable_cache } from "next/cache";
import { Flashcard_item, Flashcard_set } from "@/app/_types/types";

export type Flashcard_set_with_random_item = Flashcard_set & {
    item_question: string;
    question_img: string | undefined;
    answer_img: string | undefined;
    item_answer: string;
};

export const randomQuestion = async ({
    userId,
}: {
    userId: string;
}): Promise<Flashcard_set_with_random_item | undefined> => {
    const cacheRnadomQuestion = unstable_cache(
        async () => {
            try {
                const result: Flashcard_set_with_random_item[] = await db`
                WITH setIds AS (
                    SELECT id
                    FROM flashcard_set
                    WHERE user_id = ${userId}
                )
                SELECT fs.*, fi.item_question as item_question, fi.item_answer as item_answer
                FROM flashcard_item fi
                LEFT JOIN flashcard_set fs ON fs.id = fi.set_id
                WHERE fi.set_id::text = ANY(ARRAY(SELECT id::text FROM setIds))
                ORDER BY random()
                LIMIT 1;
                `;

                return result[0];
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log("randoom");
                    console.log(error.message);
                }
            }
        },
        [],
        { revalidate: 60 * 60 * 12 }
    );
    return cacheRnadomQuestion();
};
