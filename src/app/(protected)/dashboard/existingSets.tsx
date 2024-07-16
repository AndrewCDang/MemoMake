import React from "react";
import { Session } from "next-auth";
import style from "./existingSets.module.scss";
import GenericButton from "@/app/_components/(buttons)/genericButtton";
import { fetchAccountFromUserId } from "@/app/_actions/fetchAccountFromUserId";
import { notFound } from "next/navigation";
import fetchExistingSetsFromId from "@/app/_actions/fetchExistingSetsFromId";
import CreateCollectionBtn from "./_dashboardButtons/createCollectionBtn";
import {
    fetchCollectionByIdJoinSet,
    Flashcard_collection_set_joined,
} from "@/app/_actions/fetchCollectionByIdJoinSet";
import PreviewModal from "@/app/_components/previewModal/previewModal";
import { fetchRecentTested } from "./_actions/fetchRecentTested";
import DashboardLanding from "./_dashboardSections/dashboardLanding";
import SetAndCollectionCard from "@/app/_components/setAndCollectionCard/setAndCollectionCard";
import CreateSetBtn from "./_dashboardButtons/createSetBtn";
import { Flashcard_set } from "@/app/_types/types";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs/svgs";
import { AiFillPushpin } from "react-icons/ai";
import ReviseModal from "@/app/_components/reviseCollection/reviseModal";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { fetchUserNotes } from "./_dashboardSections/pinAndToDo/_actions/fetchUserNotes";

// Dashboard Page containing sections of card content
async function ExistingSets({ session }: { session: Session | null }) {
    if (!session) return null;

    // Data Fetching
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
    const favouriteCollections = collectionWithSets
        ? collectionWithSets.filter((item) => favArray.includes(item.id))
        : [];

    // Fetch Recently tested
    const fetchHistory = await fetchRecentTested({ userId: session.user.id });
    console.log(fetchHistory);

    // Section Template
    type SectionTemplateTypes = {
        CreateBtn?: React.JSX.Element;
        Icon?: React.JSX.Element;
        title: string;
        itemsArray: {
            contentType: "collection" | "set";
            array: Flashcard_set[] | Flashcard_collection_set_joined[];
        }[];
    };

    // Fetch User Notes
    const userNotes = (await fetchUserNotes(session.user.id)) || [];

    // Template dividing each section of dashboard, displaying groups of sets/collection/pinned items
    const SectionTemplate = ({
        CreateBtn,
        Icon,
        title,
        itemsArray,
    }: SectionTemplateTypes) => {
        return (
            <section className={style.sectionContainer}>
                <div className={style.sectionTitle}>
                    <div className={style.iconAndTitle}>
                        {Icon && Icon}
                        <h6>{title}</h6>
                    </div>
                    {CreateBtn && (
                        <div className={style.sectionBtnGroup}>{CreateBtn}</div>
                    )}
                </div>
                <section className={style.setGrid}>
                    {itemsArray &&
                        itemsArray.map((sets) => {
                            return sets.array.map((set) => {
                                return (
                                    <SetAndCollectionCard
                                        set={set}
                                        account={account}
                                        contentType={sets.contentType}
                                    />
                                );
                            });
                        })}
                </section>
            </section>
        );
    };

    return (
        <section>
            {/* Recent sets/collection Selection */}
            <div className={style.sectionTitle}>
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
            </div>
            {/* Sets Selection */}
            <SectionTemplate
                title="Flash Card Sets"
                Icon={<SetIcon />}
                CreateBtn={<CreateSetBtn />}
                itemsArray={[{ contentType: "set", array: searchExistingSets }]}
            />
            {/* Collection Section */}
            <SectionTemplate
                title="Flash Card Collection"
                Icon={<CollectionIcon />}
                CreateBtn={<CreateCollectionBtn />}
                itemsArray={[
                    {
                        contentType: "collection",
                        array: collectionWithSets || [],
                    },
                ]}
            />
        </section>
    );
}

export default ExistingSets;
