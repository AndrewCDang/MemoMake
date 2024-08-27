import React from "react";
import { auth } from "@/auth";
import { fetchAccountFromUserId } from "@/app/_lib/fetch/fetchAccountFromUserId";
import SectionTemplate from "@/app/_components/setCollectionContentSection/sectionTemplate";
import { Metadata } from "next";
import { fetchPopularSets } from "./fetch/fetchPopularSets";
import { fetchPopularCollections } from "./fetch/fetchPopularCollections";

export const metadata: Metadata = {
    title: "Quizmu | Disover",
    description: "Discover/Search for public Flash Card Sets and Collections",
};

async function Page({ searchParams }: { searchParams: any }) {
    const searchPage = searchParams.page || ("1" as string);
    const session = await auth();
    const itemsPerPage = 8;

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    const fetchFlashSets = await fetchPopularSets({
        paginate: true,
        itemsPerPage: itemsPerPage,
        pageNum: searchPage,
    });

    // const fetchCollection = await fetchPopularCollections({
    //     itemsPerPage: itemsPerPage,
    //     pageNum: searchPage,
    //     paginate: true,
    // });
    console.log("coelcaew");
    console.log(fetchFlashSets);

    return (
        <main>
            <section>
                <label>Popular Results</label>
                {/* <h2>{capitaliseFirstChar(searchQuery) || "Discover"}</h2> */}
            </section>
            <SectionTemplate
                createBtn={false}
                filter={false}
                id="popular-sets-flashcards"
                content={(fetchFlashSets && fetchFlashSets.fetched_items) || []}
                title={`Popular Sets`}
                account={userAccount}
                contentType="set"
                totalPaginationItems={fetchFlashSets?.total_count || null}
                totalItemsPerPage={itemsPerPage}
                paginationLink={`/discover/popular?`}
                currentPagPage={Number(searchPage)}
                publicPage={true}
            />
            {/* <SectionTemplate
                createBtn={false}
                filter={true}
                id="popular-sets-flashcards"
                content={
                    (fetchCollection && fetchCollection.fetched_items) || []
                }
                title={`Popular Collections`}
                account={userAccount}
                contentType="collection"
                totalPaginationItems={fetchFlashSets?.total_count || null}
                totalItemsPerPage={itemsPerPage}
                paginationLink={`/discover/popular?`}
                currentPagPage={Number(searchPage)}
                publicPage={true}
            /> */}
        </main>
    );
}

export default Page;
