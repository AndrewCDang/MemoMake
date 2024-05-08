import React from "react";
import { auth } from "@/auth";
import ExistingSets from "./existingSets";
import DashboardModal from "./_dashboardModals/dashboardModal";
import { FetchCollectionSetCount } from "@/app/_actions/fetchCollectionSetCount";
import { notFound } from "next/navigation";

async function page() {
    const session = await auth();
    if (!session) notFound();
    const collectionSet = await FetchCollectionSetCount({
        userId: session.user.id,
    });

    return (
        <section>
            <ExistingSets session={session} />
            {collectionSet && (
                <DashboardModal
                    collectionSet={collectionSet}
                    userId={session.user.id}
                />
            )}
        </section>
    );
}

export default page;
