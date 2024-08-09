import React from "react";
import { fetchPublicFlashsets } from "../_lib/fetch/fetchPublicFlashsets";
import { auth } from "@/auth";
import { fetchAccountFromUserId } from "../_lib/fetch/fetchAccountFromUserId";
import { fetchPublicFlashCollections } from "../_lib/fetch/fetchPublicFlashCollections";
import SectionTemplate from "../_components/setCollectionContentSection/sectionTemplate";
import { capitaliseFirstChar } from "../_functions/capitaliseFirstChar";

async function page({ searchParams }: { searchParams: any }) {
    const searchQuery = searchParams.search as string;
    const searchType = searchParams.type;
    const session = await auth();
    const itemsPerPage = 12;

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    const fetchFlashSets = searchQuery
        ? await fetchPublicFlashsets({
              searchQuery: searchQuery,
              paginate: true,
              itemsPerPage: itemsPerPage,
              pageNum: 1,
          })
        : undefined;

    const fetchCollection = searchQuery
        ? await fetchPublicFlashCollections({
              searchQuery,
              itemsPerPage: itemsPerPage,
              pageNum: 1,
              paginate: true,
          })
        : undefined;

    return (
        <main>
            <section>
                <label>Results for</label>
                <h2>{capitaliseFirstChar(searchQuery) || "Discover"}</h2>
                {searchType && <div>{searchType}</div>}
            </section>
            <SectionTemplate
                createBtn={false}
                filter={false}
                title={`Flash Card Sets for '${capitaliseFirstChar(
                    searchQuery
                )}'`}
                id="discover-flashcards"
                content={(fetchFlashSets && fetchFlashSets.fetched_items) || []}
                href={`/discover/sets?search=${searchQuery}`}
                contentType="set"
                totalPaginationItems={fetchFlashSets?.total_count}
                account={userAccount}
                viewBtn={true}
                totalItemsPerPage={itemsPerPage}
            />
            <SectionTemplate
                createBtn={false}
                filter={false}
                title={`Flash Card Collections for '${capitaliseFirstChar(
                    searchQuery
                )}'`}
                id="discover-flashcollection"
                content={fetchCollection?.fetched_items || []}
                href="/discover/sets"
                contentType="collection"
                totalPaginationItems={fetchCollection?.total_count}
                account={userAccount}
                viewBtn={true}
                totalItemsPerPage={itemsPerPage}
            />
        </main>
    );
}

export default page;
