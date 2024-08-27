import NextAuth from "next-auth";
import { getUserById } from "./app/_data/user";
import { UserRole } from "./app/_types/types";
import generateVerificationToken from "./app/_lib/generateToken";
import { db } from "./app/_lib/db";
import credentials from "next-auth/providers/credentials";
import { AuthSchema } from "./schema/authSchema";
import { getUserByEmail } from "./app/_data/user";
import bcrypt from "bcryptjs";
import google from "next-auth/providers/google";
import generateCustomUserId from "./app/_actions/generateCustomUserId";

// Combines google.sub and email to output unique id in valid uu4 id format

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    events: {
        // linkAccount called when user signs up into into third party authentication
        async linkAccount({ user, profile }) {
            if (user.id === undefined) {
                throw new Error("User ID is undefined.");
            }
            await db`
                UPDATE users
                SET email_verified = ${new Date()}
                WHERE id = ${user.id}
            `;
        },
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.id || !user.email) return false;
            const existingUser = await getUserById(user.id);
            if (account?.provider === "google") {
                if (!profile?.email || !profile?.sub) return false;
                const profileId = await generateCustomUserId(
                    profile.email,
                    profile.sub
                );

                const existingAccount = await getUserById(profileId);

                if (!existingAccount) {
                    await db`
                        INSERT INTO users (id, user_name, email, email_verified, image)
                        VALUES (${profileId}, ${
                        profile?.name || user.name || ""
                    }, ${user.email}, ${new Date()} , ${user.image || ""})
                    `;
                }
                user.id = profileId;
                return true;
            }

            if (existingUser?.email_verified) return true;

            if (!existingUser?.email_verified) {
                await generateVerificationToken(user.email);
            }

            return false;
        },
        async session({ token, session }) {
            console.log(token);
            console.log(session);
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.user_name && session.user) {
                session.user.user_name = token.user_name as string;
            }
            if (token.user_name && session.user) {
                session.user.image = token.image as string;
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole;
            }
            return session;
        },

        async jwt({ token }) {
            if (!token.sub) return token;
            // const userRole = await getUserById(token.sub);

            try {
                const response = await fetch(
                    `${process.env.WEBSITE_URL}/api/getUser?userId=${token.sub}`
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                token.image = data.user.image;
                token.user_name = data.user.user_name;
                const userRole = data.user.role;
                if (!userRole) return token;
                token.role = userRole.role;
            } catch (error) {
                console.error("Failed to fetch:", error);
            }

            return token;
        },
    },
    providers: [
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            async profile(profile) {
                const profileId = await generateCustomUserId(
                    profile.email,
                    profile.sub
                );
                console.log(profileId);
                return {
                    id: profileId,
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
                    console.log("success");
                }
                console.log("no success");

                return null;
            },
        }),
    ],
});
