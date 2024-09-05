"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import { db } from "../_lib/db";

export const toggleSetPublicAccess = async ({ setId }: { setId: string }) => {
    try {
        // Fetch the current public access state
        const previousPublicState: { public_access: boolean }[] = await db`
            SELECT public_access FROM flashcard_set
            WHERE id = ${setId}
        `;

        if (previousPublicState.length === 0) {
            console.log("Could not find set with ID:", setId);
            return { status: 404, message: "Set not found" };
        }

        const currentPublicAccess = previousPublicState[0].public_access;

        // Toggle the public_access field based on its current state
        const newPublicAccess = !currentPublicAccess;
        const updateResult = await db`
            UPDATE flashcard_set
            SET public_access = ${newPublicAccess}
            WHERE id = ${setId}
            RETURNING public_access
        `;

        // Revalidate the cache/tag
        revalidateTag(setId);
        revalidatePath(`/dashboard/edit/${setId}`);

        // Return success response
        return {
            status: 200,
            message: `Public access toggled to ${newPublicAccess}`,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error in toggleSetPublicAccess:", error.message);
            return { status: 500, message: error.message };
        }
        // Handle unknown errors
        console.error("Unknown error in toggleSetPublicAccess");
        return { status: 500, message: "An unknown error occurred" };
    }
};
