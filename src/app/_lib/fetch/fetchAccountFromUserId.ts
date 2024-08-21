import { db } from "../db";
import { AccountWithLikes } from "../../_types/types";
import { unstable_cache } from "next/cache";

export const fetchAccountFromUserId = async ({
    id,
}: {
    id: string;
}): Promise<AccountWithLikes | undefined> => {
    const cachedAccount = unstable_cache(
        async () => {
            try {
                const account = await db`
                    SELECT u.user_name, u.image, a.*, json_agg(ul.*) as user_likes FROM account a
                    LEFT JOIN user_likes ul ON ul.user_id = a.user_id
                    LEFT JOIN users u ON u.id = a.user_id
                    WHERE a.user_id = ${id}
                    GROUP BY a.id, u.user_name, u.image
                `;
                if (account.length === 0 || !account[0]) {
                    console.log({ status: 204, message: "No account found" });
                    return undefined;
                }

                return account[0] as AccountWithLikes;
            } catch (error: unknown) {
                if (error instanceof Error) {
                    console.log({ status: 500, message: error.message });
                    return undefined;
                }
            }
        },
        [id],
        { tags: ["userAccount"] }
    );
    return cachedAccount();
};
