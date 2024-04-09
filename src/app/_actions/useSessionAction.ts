"use server";
import { auth } from "@/auth";

export const useSessionServer = async () => {
    const session = await auth();
    if (session) {
        const userSession = session.user;

        return userSession;
    }
};
