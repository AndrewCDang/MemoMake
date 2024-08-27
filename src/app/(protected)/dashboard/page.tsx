import React from "react";
import { auth } from "@/auth";
import ExistingSets from "./existingSets";
import DashboardModal from "./_dashboardModals/dashboardModal";
import { fetchCollectionSetCount } from "@/app/_lib/fetch/fetchCollectionSetCount";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quizmu | Dashboard",
    description: "View all your Flash Sets and Collections here",
};

async function Page() {
    const session = await auth();
    if (!session) notFound();

    const collectionSet = await fetchCollectionSetCount({
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

export default Page;
