"use server";

import { db } from "@/app/_lib/db";
import { getVerificationByToken } from "../_lib/verificationToken";

const updateVerified = async ({ email }: { email: string }) => {
    try {
        await db`
            UPDATE users
            SET email_verified = ${new Date()}
            WHERE email = ${email}
        `;
        return { updated: true };
    } catch (error) {}
};

const deleteVerificationToken = async (token: string) => {
    try {
        await db`
            DELETE FROM verification_token
            WHERE token = ${token}
        `;

        return {
            success: true,
            message:
                "Email verified. Token no longer required and deleted from database.",
        };
    } catch (error) {
        return {
            success: false,
            message: "Could not delete verification token",
        };
    }
};

const newVerification = async ({ token }: { token: string }) => {
    const verifyAttempt = await getVerificationByToken(token);

    if (verifyAttempt?.token) {
        const expirationTime = new Date(verifyAttempt.expires);
        const currentTime = new Date();
        if (currentTime < expirationTime) {
            const updatedUser = await updateVerified({
                email: verifyAttempt.email,
            });
            if (updatedUser?.updated) {
                const deletedToken = await deleteVerificationToken(token);
                return {
                    success: true,
                    message: "Success: Email verified",
                    deletedToken,
                };
            }
        } else {
            return { success: false, message: "Verification link expired" };
        }
    } else {
        return { success: false, message: "Verification link invalid" };
    }
};

export default newVerification;
