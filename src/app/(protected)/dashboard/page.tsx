import React from "react";
import { auth } from "@/auth";
import CreateSet from "./createSet";
import ExistingSets from "./existingSets";

async function page() {
    const session = await auth();
    return (
        <section>
            <ExistingSets session={session} />
            <CreateSet />
        </section>
    );
}

export default page;
