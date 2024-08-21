import { auth } from "@/auth";

export const getSessionServer = async () => {
    const session = await auth();
    if (session) {
        const userSession = session.user;

        return userSession;
    }
};
