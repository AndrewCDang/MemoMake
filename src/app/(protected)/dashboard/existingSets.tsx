import React from "react";
import { Session } from "next-auth";
import { Account } from "@/app/_types/types";
import { Flashcard_set } from "@/app/_types/types";
import style from "./existingSets.module.scss";
import { HiArrowRightCircle } from "react-icons/hi2";
import Link from "next/link";
import GenericButton from "@/app/_components/(buttons)/genericButtton";
import FavouriteIcon from "@/app/_components/favouriteIcon/favouriteIcon";
import { fetchAccountFromUserId } from "@/app/_actions/fetchAccountFromUserId";
import { notFound } from "next/navigation";
import fetchExistingSetsFromId from "@/app/_actions/fetchExistingSetsFromId";
import { fetchCollectionById } from "@/app/_actions/fetchCollectionById";
import CreateCollectionBtn from "./_dashboardButtons/createCollectionBtn";
import CreateSetBtn from "./_dashboardButtons/createSetBtn";
import { fetchCollectionByIdJoinSet } from "@/app/_actions/fetchCollectionByIdJoinSet";
import CollectionTest from "./_dashboardItems/collectionItem/collectionTest";
import CollectionItem from "./_dashboardItems/collectionItem/collectionItem";

// Card Component
const FlashCardItem = ({
    set,
    index,
    account,
}: {
    set: Flashcard_set;
    index: number;
    account: Account;
}) => {
    return (
        <section key={index} className={style.setContainer}>
            <div className={style.setContent}>
                <h4>{set.set_name}</h4>
                <div className={style.categoryContainer}>
                    {set.set_categories.map((category, index) => {
                        return <label key={index}>{category}</label>;
                    })}
                </div>
                {set.description && <p>{set.description}</p>}
            </div>
            <div className={style.viewSet}>
                <p>Study</p>
                <HiArrowRightCircle />
            </div>
            <Link href={`dashboard/flashcard?id=${set.id}`}>
                <div className={style.viewSet}>
                    <p>View Set</p>
                    <HiArrowRightCircle />
                </div>
            </Link>
            <div>
                <FavouriteIcon
                    favourited={
                        account !== undefined
                            ? account.favourites.includes(set.id)
                            : false
                    }
                    userId={account.user_id}
                    setId={set.id}
                />
            </div>
        </section>
    );
};

async function ExistingSets({ session }: { session: Session | null }) {
    if (!session) return null;
    const searchExistingSets = await fetchExistingSetsFromId(session.user.id);

    const account = await fetchAccountFromUserId({ id: session.user.id });
    if (!account) return notFound();

    const favArray = account.favourites;
    const favouriteSets = searchExistingSets.filter((item) =>
        favArray.includes(item.id)
    );

    const existingCollections = await fetchCollectionById({
        id: session.user.id,
    });

    type RecentlyTestedTypes = {
        type: "set" | "collection";
        id: string;
    };

    const collectionWithSets = await fetchCollectionByIdJoinSet({
        id: session.user.id,
    });

    return (
        <section>
            <div></div>
            <div className={style.sectionTitle}>
                <h3>Recently Tested</h3>
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
            <div className={style.sectionTitle}>
                <h3>Flash Card Sets</h3>
                <div className={style.sectionBtnGroup}>
                    <CreateSetBtn />
                </div>
            </div>
            <section className={style.setGrid}>
                {searchExistingSets &&
                    searchExistingSets.map((set, index) => {
                        return (
                            <FlashCardItem
                                set={set}
                                index={index}
                                account={account}
                            />
                        );
                    })}
            </section>
            <div className={style.sectionTitle}>
                <h3>Collection</h3>
                <CreateCollectionBtn />
            </div>
            {collectionWithSets && (
                <CollectionItem collectionWithSets={collectionWithSets} />
            )}
        </section>
    );
}

export default ExistingSets;
