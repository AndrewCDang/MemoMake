"use server";
import { db } from "../_lib/db";
import { Account } from "../_types/types";

export const fetchAccountFromUserId = async ({
    id,
}: {
    id: string;
}): Promise<Account | undefined> => {
    try {
        const account = await db`
            SELECT * FROM account
            WHERE user_id = ${id}
        `;
        if (account.length === 0 || !account[0]) {
            console.log({ status: 204, message: "No account found" });
            return undefined;
        }

        return account[0] as Account;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.log({ status: 500, message: error.message });
            return undefined;
        }
    }
};
