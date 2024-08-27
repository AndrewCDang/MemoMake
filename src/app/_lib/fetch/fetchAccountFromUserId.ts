import { db } from "../db";
import { AccountWithLikesAndPins } from "../../_types/types";
import { unstable_cache } from "next/cache";

export const fetchAccountFromUserId = async ({
    id,
}: {
    id: string;
}): Promise<AccountWithLikesAndPins | undefined> => {
    const cachedAccount = unstable_cache(
        async () => {
            try {
                const account = await db`
                    SELECT u.user_name, u.image, a.*, json_agg(ul.*) as user_likes, json_agg(up.*) as user_pins FROM account a
                    LEFT JOIN user_likes ul ON ul.user_id = a.user_id
                    LEFT JOIN users u ON u.id = a.user_id
                    LEFT JOIN user_pins up ON up.user_id = a.user_id
                    WHERE a.user_id = ${id}
                    GROUP BY a.id, u.user_name, u.image
                `;
                if (account.length === 0 || !account[0]) {
                    console.log({ status: 204, message: "No account found" });
                    return undefined;
                }

                return account[0] as AccountWithLikesAndPins;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log({ status: 500, message: error.message });
                    return undefined;
                }
            }
        },
        [],
        { tags: [`account-${id}`, `userPins-${id}`, `userLikes-${id}`] }
    );
    return cachedAccount();
};
