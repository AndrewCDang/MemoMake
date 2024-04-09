"use server";

import { db } from "@/app/_lib/db";
import { PasswordResetToken } from "../_types/types";

const updateVerified = async ({ email }: { email: string }) => {
    try {
        await db`
            UPDATE FROM users
            SET email_verified = ${new Date()}
            WHERE email = ${email}
        `;
        return { updated: true };
    } catch (error) {}
};

const resetPasswordRequest = async ({ token }: { token: string }) => {
    const selectVerifyAttempt = await db`
        SELECT * FROM password_reset_token
        WHERE token = ${token}
    `;

    const verifyAttempt = selectVerifyAttempt[0] as PasswordResetToken;

    if (verifyAttempt?.token) {
        const expirationTime = new Date(verifyAttempt.expires);
        const currentTime = new Date();
        if (currentTime < expirationTime) {
            return {
                success: true,
                message:
                    "Password-reset request granted. Redirecting to password reset form.",
            };
        } else {
            return { success: false, message: "Password-reset link expired" };
        }
    } else {
        return { success: false, message: "Password-reset  link invalid" };
    }
};

export default resetPasswordRequest;
