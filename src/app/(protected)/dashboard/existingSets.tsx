import React from "react";
import { Session } from "next-auth";
import { fetchAccountFromUserId } from "@/app/_lib/fetch/fetchAccountFromUserId";
import { notFound } from "next/navigation";
import fetchExistingSetsFromId from "@/app/_lib/fetch/fetchExistingSetsFromId";
import { fetchCollectionByIdJoinSet } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { fetchRecentTested } from "./_actions/fetchRecentTested";
import DashboardLanding from "./_dashboardSections/dashboardLanding";
import { fetchUserNotes } from "./_dashboardSections/pinAndToDo/_actions/fetchUserNotes";
import SectionTemplate from "@/app/_components/setCollectionContentSection/sectionTemplate";
import LoadingSetAndCollectionCard from "@/app/_components/setAndCollectionCard/loadingSetAndCollectionCard/loadingSetAndCollectionCard";

// Helper function to introduce a delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Dashboard Page containing sections of card content
async function ExistingSets({ session }: { session: Session | null }) {
    if (!session) return null;
    // Data Fetching
    // Fetch Sets

    const searchExistingSets =
        (await fetchExistingSetsFromId({
            userId: session.user.id,
        })) || null;

    // Fetch Collection
    const collectionWithSets = await fetchCollectionByIdJoinSet({
        id: session.user.id,
    });

    // Account
    const account =
        (await fetchAccountFromUserId({ id: session.user.id })) || null;
    if (!account) return notFound();

    const favArray = account.favourites;
    const favouriteSets =
        searchExistingSets?.fetched_items.filter((item) =>
            favArray.includes(item.id)
        ) || [];
    const favouriteCollections = collectionWithSets
        ? collectionWithSets.filter((item) => favArray.includes(item.id))
        : [];

    // Fetch Recently tested
    const fetchHistory = await fetchRecentTested({ userId: session.user.id });

    // Fetch User Notes
    const userNotes = (await fetchUserNotes(session.user.id)) || [];

    return (
        <section>
            {/* Recent sets/collection Selection */}
            <section id="dashboard_home">
                <DashboardLanding
                    userNotes={userNotes}
                    session={session}
                    recentItems={fetchHistory}
                    account={account}
                    itemsArray={[
                        { contentType: "set", array: favouriteSets },
                        {
                            contentType: "collection",
                            array: favouriteCollections,
                        },
                    ]}
                />
            </section>
            {/* Sets Selection */}
            {searchExistingSets &&
            searchExistingSets.fetched_items.length &&
            account ? (
                <SectionTemplate
                    id={"dashboard_set"}
                    filter={false}
                    title="Flash Card Sets"
                    content={searchExistingSets?.fetched_items || []}
                    contentType="set"
                    account={account}
                    href="/dashboard/sets"
                    createBtn={true}
                    viewBtn={true}
                    totalPaginationItems={searchExistingSets?.total_count}
                ></SectionTemplate>
            ) : (
                <LoadingSetAndCollectionCard contentType="set" />
            )}

            {/* Collection Section */}
            {collectionWithSets && account ? (
                <SectionTemplate
                    id={"dashboard_collection"}
                    filter={false}
                    title="Flash Card Collection"
                    content={collectionWithSets || []}
                    contentType="collection"
                    account={account}
                    href="/dashboard/collections"
                    createBtn={true}
                    viewBtn={true}
                ></SectionTemplate>
            ) : (
                <LoadingSetAndCollectionCard contentType="collection" />
            )}
        </section>
    );
}

export default ExistingSets;
