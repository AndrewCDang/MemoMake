"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../_lib/db";

export const toggleSetPublicAccess = async ({ setId }: { setId: string }) => {
    try {
        const previousPublicState: { public_access: boolean }[] = await db`
        SELECT public_access from flashcard_set
        WHERE id = ${setId}
        `;

        console.log(previousPublicState[0]);

        if (previousPublicState.length === 0) {
            console.log("Could not find set");
            return undefined;
        }

        if (previousPublicState[0].public_access === false) {
            const toggleTrue = await db`
                UPDATE flashcard_set
                SET public_access = true
                WHERE id = ${setId}
                RETURNING public_access
            `;
            revalidateTag(setId);

            return {
                status: 200,
                message: toggleTrue[0],
            };
        } else if (previousPublicState[0].public_access === true) {
            const toggleFalse = await db`
                UPDATE flashcard_set
                SET public_access = false
                WHERE id = ${setId}
                RETURNING public_access
            `;
            revalidateTag(setId);
            return {
                status: 200,
                message: toggleFalse[0],
            };
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
