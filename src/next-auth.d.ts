import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
    role: "ADMIN" | "USER";
};

// EXTENDING default types of Next-Auth Session to include additional attributes - e.g -role
declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}
