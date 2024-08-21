"use client";
import { getSessionServer } from "@/app/_actions/useSessionAction";
import { useEffect, useState } from "react";
import { ExtendedUser } from "@/next-auth";

function Page() {
    const [session, setSession] = useState<ExtendedUser>();

    const getSession = async () => {
        const session = await getSessionServer();
        setSession(session);
    };

    useEffect(() => {
        getSession();
    }, []);

    return <div>{session?.email}</div>;
}

export default Page;
