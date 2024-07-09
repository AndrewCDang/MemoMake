"use server";
import { AuthSignUp } from "../../schema/authSchema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "../_lib/db";
import { getUserByEmail } from "../_data/user";
import generateVerificationToken from "../_lib/generateToken";
import { verifyEmail } from "../(auth)/verifyEmail";
import { DataValidationType } from "../(auth)/SignUp";

export const signUp = async (
    values: z.infer<typeof AuthSignUp>
): Promise<DataValidationType> => {
    const validated = AuthSignUp.safeParse(values);

    if (!validated.success) {
        return { error: "Invalid fields", validated: false };
    }

    const { email, password, userName } = validated.data;
    console.log(validated.data);

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await getUserByEmail(email);

    const existingUserName = await db`
        SELECT * FROM users
        WHERE user_name = ${userName}
    `;

    if (existingEmail) {
        return { message: "Email already in use", validated: false };
    }
    if (existingUserName.length > 0) {
        return { message: "User Name already in use", validated: false };
    }

    try {
        const insertUser = await db`
            INSERT INTO users (user_name, email, password)
            VALUES (${userName}, ${email}, ${hashedPassword})
            RETURNING id
        `;

        if (!insertUser[0].id)
            return { validated: false, message: "Failed to insert account" };

        const userId = insertUser[0].id;

        await db`
            INSERT INTO account (user_id)
            VALUES (${userId})
        `;
    } catch (error) {
        return { validated: false };
    }

    const verification = await generateVerificationToken(email);
    if (verification) {
        if (verification.token) {
            const verifyEmailAddress = await verifyEmail({
                token: verification.token,
                userName,
                email,
                subject: "MemoMake Account Verification",
                purpose: "verifyEmail",
            });
            if (verifyEmailAddress.status === 200) {
                // Success
                return { validated: true, message: "Verification email sent!" };
            } else {
                return {
                    validated: false,
                    message:
                        "Verification email error. Please try again later or contact support.",
                };
            }
        }

        if (!verification.success) {
            return {
                validated: false,
                message:
                    "Could not create verification token. Please try again later or contact support.",
            };
        }
    }
    return {
        validated: false,
        message:
            "Could not create verification token. Please try again later or contact support.",
    };
};
