import React from "react";
import { Session } from "next-auth";
import style from "./existingSets.module.scss";
import GenericButton from "@/app/_components/(buttons)/genericButtton";
import { fetchAccountFromUserId } from "@/app/_actions/fetchAccountFromUserId";
import { notFound } from "next/navigation";
import fetchExistingSetsFromId from "@/app/_actions/fetchExistingSetsFromId";
import CreateCollectionBtn from "./_dashboardButtons/createCollectionBtn";
import { fetchCollectionByIdJoinSet } from "@/app/_actions/fetchCollectionByIdJoinSet";
import CollectionItem from "./_dashboardItems/collectionItem/collectionItem";
import PreviewModal from "@/app/_components/previewModal/previewModal";
import ReviseCollectionModal from "@/app/_components/reviseCollection/reviseCollectionModal";
import SetItem, { FlashCardItem } from "./_dashboardItems/setItem/setItem";
import { fetchRecentTested } from "./_actions/fetchRecentTested";
import RecentItems from "./_dashboardSections/recentItems";

type RecentlyTestedTypes = {
    type: "set" | "collection";
    id: string;
};

// Card Component
async function ExistingSets({ session }: { session: Session | null }) {
    if (!session) return null;

    // Fetch Sets
    const searchExistingSets = await fetchExistingSetsFromId(session.user.id);

    // Fetch Collection
    const collectionWithSets = await fetchCollectionByIdJoinSet({
        id: session.user.id,
    });

    // Account
    const account = await fetchAccountFromUserId({ id: session.user.id });
    if (!account) return notFound();

    const favArray = account.favourites;
    const favouriteSets = searchExistingSets.filter((item) =>
        favArray.includes(item.id)
    );

    // Fetch Recently tested
    const fetchHistory = await fetchRecentTested({ userId: session.user.id });

    return (
        <section>
            {/* Recent sets/collection Selection */}
            <div className={style.sectionTitle}>
                <h3>Recently Tested</h3>
                <RecentItems fetch={fetchHistory} />
                <GenericButton type="hyperlink">View All</GenericButton>
            </div>
            <div className={style.sectionTitle}>
                <h3>Favourites</h3>
                <GenericButton type="hyperlink">View All</GenericButton>
            </div>
            <section className={style.setGrid}>
                {favouriteSets &&
                    favouriteSets.map((set, index) => {
                        return (
                            <FlashCardItem
                                set={set}
                                index={index}
                                account={account}
                            />
                        );
                    })}
            </section>
            {/* Sets Selection */}
            <SetItem
                searchExistingSets={searchExistingSets}
                account={account}
            />
            {/* Collection Section */}
            <div className={style.sectionTitle}>
                <h3>Collection</h3>
                <CreateCollectionBtn />
            </div>
            {collectionWithSets && (
                <CollectionItem collectionWithSets={collectionWithSets} />
            )}
            {/* Modals | Preview set/collection | Study Settings Modal */}
            <PreviewModal />
            <ReviseCollectionModal
                session={session}
                contentType={"collection"}
            />
        </section>
    );
}

export default ExistingSets;
