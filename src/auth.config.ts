import type { NextAuthConfig } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { AuthSchema } from "@/schema/authSchema";
import { getUserByEmail } from "./app/_data/user";
import bcrypt from "bcryptjs";
import google from "next-auth/providers/google";

export default {
    providers: [
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                    user_name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        }),
        credentials({
            async authorize(credentials) {
                const validFields = AuthSchema.safeParse(credentials);

                if (validFields.success) {
                    const { email, password } = validFields.data;
                    const user = await getUserByEmail(email);
                    if (!user || !user.password) return null;

                    const passwordMatch = await bcrypt.compare(
                        password, //userInput
                        user.password //hash
                    );
                    if (passwordMatch) return user;
                }

                return null;
            },
        }),
    ],
} satisfies NextAuthConfig;
