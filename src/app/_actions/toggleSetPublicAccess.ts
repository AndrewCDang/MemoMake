"use server";
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
            await db`
                UPDATE flashcard_set
                SET public_access = true
                WHERE id = ${setId}
            `;
        } else if (previousPublicState[0].public_access === true) {
            await db`
                UPDATE flashcard_set
                SET public_access = false
                WHERE id = ${setId}
            `;
        }
        return {
            status: 200,
            message: { public_access: !previousPublicState[0].public_access },
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
        }
        return undefined;
    }
};
