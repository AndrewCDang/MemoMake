"use server";

import { Account, ContentType, UserPins } from "../_types/types";
import { db } from "../_lib/db";
import { revalidatePath, revalidateTag } from "next/cache";

export const addRemoveFavourites = async ({
    id,
    setId,
    contentType,
}: {
    id: string;
    setId: string;
    contentType: ContentType;
}) => {
    console.log("fetchUpdatePins");
    console.log(id);
    console.log(setId);
    console.log(contentType);
    try {
        // const account: Account[] = await db`
        //     SELECT * FROM account
        //     WHERE user_id = ${id}
        // `;

        // if (account.length === 0 || !account[0])
        //     return { status: 204, message: "Could not find Account" };

        // // Check if the setId is already in the favourites array
        // const isSetIdInFavourites = account[0].favourites.includes(setId);

        // // If setId is already in favourites, removes it
        // if (isSetIdInFavourites) {
        //     const updatedFavourites = account[0].favourites.filter(
        //         (item) => item !== setId
        //     );
        //     await db`
        //         UPDATE account
        //         SET favourites = ${updatedFavourites}
        //         WHERE user_id = ${id}
        //     `;
        // } else {
        //     const updatedFavourites = [...account[0].favourites, setId];
        //     await db`
        //         UPDATE account
        //         SET favourites = ${updatedFavourites}
        //         WHERE user_id = ${id}
        //     `;
        // }

        const account: UserPins[] = await db`
            SELECT * FROM user_pins
            WHERE user_id = ${id} AND item_id =${setId}
        `;

        // If pin object does not exist, create
        if (account.length === 0 || !account[0]) {
            try {
                const addPin = await db`
                    INSERT INTO user_pins(item_id,user_id,item_type)
                    VALUES(${setId},${id},${contentType})
                `;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        } else {
            try {
                const removePin = await db`
                    DELETE FROM user_pins
                    WHERE user_id = ${id} AND item_id =${setId}
                `;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log(error.message);
                }
            }
        }
        revalidateTag(`userAccount-${id}`);
        revalidateTag(`userPins-${id}`);

        return { status: 200, message: "Item Updated" };
    } catch (error: unknown) {
        console.log(error);
        if (error instanceof Error) {
            return { status: 500, message: error.message };
        }
    }
};
