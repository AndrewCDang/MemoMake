import { fetchAccountFromUserId } from "@/app/_lib/fetch/fetchAccountFromUserId";
import { fetchPublicFlashsets } from "@/app/_lib/fetch/fetchPublicFlashsets";
import SectionTemplate from "@/app/_components/setCollectionContentSection/sectionTemplate";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { auth } from "@/auth";
import React from "react";

async function Page({ searchParams }: { searchParams: any }) {
    const searchQuery = searchParams.search as string;
    const searchPage = searchParams.page || ("1" as string);
    const session = await auth();
    const itemsPerPage = 18;

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    const fetchFlashSets = searchQuery
        ? await fetchPublicFlashsets({
              searchQuery: searchQuery,
              paginate: true,
              itemsPerPage: itemsPerPage,
              pageNum: Number(searchPage),
          })
        : null;

    return (
        <SectionTemplate
            createBtn={false}
            filter={true}
            id="discover-sets-flashcards"
            content={(fetchFlashSets && fetchFlashSets.fetched_items) || []}
            title={`Flash Card Sets for '${capitaliseFirstChar(searchQuery)}'`}
            account={userAccount}
            contentType="set"
            totalPaginationItems={fetchFlashSets?.total_count || null}
            totalItemsPerPage={itemsPerPage}
            paginationLink={
                searchQuery ? `/discover/sets?search=${searchQuery}` : null
            }
            currentPagPage={Number(searchPage)}
        />
    );
}

export default Page;
