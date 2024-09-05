"use server";
import { AuthSchema } from "../../schema/authSchema";
import { z } from "zod";
import { signIn } from "@/auth";
import { defaultLogInRedirect } from "@/routes";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { getUserByEmail } from "../_data/user";
import generateVerificationToken from "../_lib/generateToken";

export const logIn = async (
    values: z.infer<typeof AuthSchema>
): Promise<{ validated: boolean; message?: string } | null> => {
    const validated = AuthSchema.safeParse(values);

    if (!validated.success) {
        return { validated: false, message: "Invalid Fields" };
    }

    const { password, email } = validated.data;

    const existingAccount = await getUserByEmail(email);

    if (!existingAccount?.email_verified) {
        const verificationToken = await generateVerificationToken(email);

        return {
            validated: false,
            message: `Verify email first before logging in.${
                verificationToken && "\nNew verification email sent."
            }`,
        };
    }

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: defaultLogInRedirect,
        });
        return { validated: true };
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return {
                        validated: false,
                        message: "Invalid Email or Password",
                    };
                default:
                    return {
                        validated: false,
                        message: "Something went wrong",
                    };
            }
        }
    }
    redirect("/dashboard");

    return { validated: true };

    // throw error;
};
