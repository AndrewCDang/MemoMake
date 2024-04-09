import { db } from "./db";
import type { VerificationToken } from "../_types/types";

export const getVerificationByEmail = async (
    email: string
): Promise<VerificationToken | null> => {
    try {
        const verification = await db`
            SELECT * FROM verification_token
            WHERE email = ${email}
            LIMIT 1
        `;

        if (verification) {
            const verificationItem = verification[0];
            return verificationItem as VerificationToken;
        }
        return null;
    } catch (error) {
        return null;
    }
};

export const getVerificationByToken = async (token: string) => {
    try {
        const selectVerification = await db`
            SELECT * FROM verification_token
            WHERE token = ${token}
        `;

        const verification = selectVerification[0] as VerificationToken;

        if (verification) {
            return verification;
        }
    } catch (error) {}
};
