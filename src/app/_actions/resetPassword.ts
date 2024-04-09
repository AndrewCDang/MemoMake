"use server";
import { db } from "../_lib/db";
import bcrypt from "bcryptjs";
import { PasswordResetToken } from "../_types/types";

export const resetPassword = async ({
    password,
    token,
}: {
    password: string;
    token: string;
}) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const selectUserToken = await db`
        SELECT * FROM password_reset_token
        WHERE token = ${token}
    `;
    const userToken = selectUserToken[0] as PasswordResetToken;
    console.log(userToken);

    if (!userToken) {
        return {
            success: false,
            message: "Could not retrieve user details. Contact support",
        };
    }

    // Updating User password (hashed)
    try {
        await db`
            UPDATE users
            SET password = ${hashedPassword}
            WHERE email = ${userToken.email}
        `;
    } catch (error) {
        console.log("Error Updating user password");
        return { success: false, message: "Error updating user password" };
    }

    // Removing password reset token from database after successful update
    try {
        await db`
            DELETE FROM password_reset_token
            WHERE token = ${token}
        `;
    } catch (error) {
        console.log("Error deleting token");
    }

    return {
        success: true,
        message: "Updated user password.",
    };
};
