"use server";
import { db } from "../_lib/db";
import { v4 as uuidV4 } from "uuid";
import { verifyEmail } from "../(auth)/verifyEmail";
import { PasswordResetToken } from "../_types/types";

const forgotPassword = async ({ email }: { email: string }) => {
    const verificationToken = uuidV4();

    const userEmails = await db`
        SELECT * FROM users
        WHERE email =${email}
    `;

    const userEmail = userEmails[0];

    if (!userEmail) {
        return {
            success: false,
            status: 500,
            message: "Email does not exist",
        };
    }

    // Checks if existing verification email object exist in db, deletes if existing match found.
    const selectExistingResetToken = await db`
        SELECT * FROM password_reset_token
        WHERE email = ${email}
    `;

    const existingResetToken =
        selectExistingResetToken[0] as PasswordResetToken;

    if (existingResetToken) {
        await db`
            DELETE FROM password_reset_token
            WHERE id = ${[existingResetToken.id]}
        `;
    }

    // Generates verification reset object in database
    try {
        await db`
            INSERT INTO password_reset_token (email, expires, token)
            VALUES(${email}, ${new Date(
            new Date().getTime() + 3600 * 1000
        )}, ${verificationToken})
        `;
    } catch (error) {
        console.error("Error creating password reset token:", error);
        return {
            success: false,
            status: 500,
            message:
                "Could not generate password reset token. Contact support or try again later.",
        };
    }

    // Sends usesr reset link via email
    try {
        await verifyEmail({
            userName: userEmail.userName as string,
            token: verificationToken,
            subject: "MemoMake Password reset",
            email: userEmail.email as string,
            purpose: "resetPassword",
        });
    } catch (error) {
        console.log("Could not send Email via Resend");
        return {
            success: false,
            status: 500,
            message: "Could not send verification email",
        };
    }

    return {
        success: true,
        status: 200,
        message: "Password reset sent to email address",
    };
};

export default forgotPassword;
