"use client";
import { useSessionServer } from "@/app/_actions/useSessionAction";
import { useEffect, useState } from "react";
import { ExtendedUser } from "@/next-auth";

function page() {
    const [session, setSession] = useState<ExtendedUser>();

    const getSession = async () => {
        const session = await useSessionServer();
        setSession(session);
    };

    useEffect(() => {
        getSession();
    }, []);

    return <div>{session?.email}</div>;
}

export default page;
