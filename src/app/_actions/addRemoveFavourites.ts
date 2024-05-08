"use server";

import { Account } from "../_types/types";
import { db } from "../_lib/db";

export const addRemoveFavourites = async ({
    id,
    setId,
}: {
    id: string;
    setId: string;
}) => {
    try {
        const account: Account[] = await db`
            SELECT * FROM account
            WHERE user_id = ${id}
        `;

        if (account.length === 0 || !account[0])
            return { status: 204, message: "Could not find Account" };

        // Check if the setId is already in the favourites array
        const isSetIdInFavourites = account[0].favourites.includes(setId);

        // If setId is already in favourites, removes it
        if (isSetIdInFavourites) {
            const updatedFavourites = account[0].favourites.filter(
                (item) => item !== setId
            );
            await db`
                UPDATE account
                SET favourites = ${updatedFavourites}
                WHERE user_id = ${id}
            `;
        } else {
            const updatedFavourites = [...account[0].favourites, setId];
            await db`
                UPDATE account
                SET favourites = ${updatedFavourites}
                WHERE user_id = ${id}
            `;
        }
        return { status: 200, message: "Item Updated" };
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return { status: 500, message: error.message };
        }
    }
};
